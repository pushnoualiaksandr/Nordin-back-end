import { HttpStatus, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Observable, throwError, timer } from 'rxjs';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as https from 'https';
import { parseErrorHtml } from '@/utils/data/functions/parceErrorHtml';

type MedicalNetworkAuthResponse = { AuthToken: string };

@Injectable()
export class MedicalNetworkBaseApiService implements OnApplicationBootstrap {
    private readonly logger = new Logger(MedicalNetworkBaseApiService.name);
    private readonly baseUrl: string;
    private readonly userName: string;
    private readonly password: string;
    private readonly authHeader: string;
    private readonly RETRY_INTERVAL = 5000;
    private readonly MAX_RETRY_COUNT = 3;
    private readonly RETRY_STATUS_CODES: HttpStatus[] = [HttpStatus.TOO_MANY_REQUESTS, HttpStatus.UNAUTHORIZED];

    private accessToken: string | null = null;
    private tokenExpiry: Date | null = null;
    private tokenPromise: Promise<string> | null = null;

    constructor(
        private readonly configService: ConfigService,
        protected readonly http: HttpService,
    ) {
        this.baseUrl = this.configService.getOrThrow('medical_network.url');
        this.userName = this.configService.getOrThrow('medical_network.userName');
        this.password = this.configService.getOrThrow('medical_network.password');
        this.authHeader = 'Basic ' + Buffer.from(`${this.userName}:${this.password}`).toString('base64');

    }


    onApplicationBootstrap(): void {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });
        this.http.axiosRef.defaults.baseURL = this.baseUrl;
        this.http.axiosRef.defaults.httpsAgent = httpsAgent;
        this.http.axiosRef.interceptors.request.use(
            this.onRequest.bind(this),
            this.onRequestError.bind(this)
        );

        this.http.axiosRef.interceptors.response.use(
            this.onResponse.bind(this),
            this.onResponseError.bind(this)
        );
        }

    protected retryCallback(err: AxiosError, retryCount: number): Observable<0> {
        return retryCount >= this.MAX_RETRY_COUNT ||
        !this.RETRY_STATUS_CODES.some((code) => code === err.response?.status)
            ? throwError(() => {
                this.logger.error({ err }, 'Medical network API request failed');
                return err;
            })
            : timer(this.RETRY_INTERVAL);
    }

    protected handleError(err: any): Observable<never> {
        let errorMessage = err.response?.data || err.message || 'Medical network error';


        if (typeof errorMessage === 'string' && errorMessage.includes('<HTML>')) {
            errorMessage = parseErrorHtml(errorMessage);
        }
        this.logger.error(
            {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                code: err.code,
            },
            'Medical network error',
        );


        const error = {
            status: err.response?.status || 500,
            message: errorMessage || 'Medical network error',
            code: err.code,
            originalError: err
        };

        return throwError(() => error);
    }

    private async getAccessToken(forceRefresh = false): Promise<string> {

        if (!forceRefresh && this.tokenPromise) {
            return this.tokenPromise;
        }

        if (!forceRefresh && this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
            return this.accessToken;
        }


        this.tokenPromise = this.fetchNewToken();

        try {
            return  await this.tokenPromise;

        } finally {
            this.tokenPromise = null;
        }
    }

    private async fetchNewToken(): Promise<string> {
        this.logger.log('Requesting new access token from Medical network');


        const request$ = this.http.axiosRef.get<MedicalNetworkAuthResponse>(
            `${this.baseUrl}/mobile/token`,
            {
                headers: {
                    'Authorization': this.authHeader,
                    'Content-Type': 'application/json',
                },

                transformRequest: [(data) => data],
                transformResponse: [(data) => data],

            }
        );

        try {
            const response = await request$;
            const authToken = JSON.parse(response.data as unknown as string);




            if (!authToken?.AuthToken) {
                throw new Error('No access token in response');
            }


            this.accessToken = authToken.AuthToken
            this.tokenExpiry = new Date(Date.now() + 25 * 60 * 1000);

            this.logger.log('Successfully obtained new access token');

            return authToken.AuthToken;
        } catch (error) {
            this.logger.error({ error }, 'Failed to obtain access token');
            throw error;
        }
    }


    private async onRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {

        if (config.url?.includes('/mobile/token')) {
            return config;
        }

        this.logger.log(
            {
                url: config.url,
                method: config.method,
                params: config.params,
                headers: config.headers,
            },
            'Outgoing HTTP request to Medical network',
        );

        try {
            const token = await this.getAccessToken();

            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`,
            };
        } catch (error) {
            this.logger.error('Failed to set auth token for request', error);
            throw error;
        }

        return config;
    }

    private onResponse(response: AxiosResponse): AxiosResponse {
        this.logger.log(
            {
                data: response.data,
                code: response.status,
                status: response.status,
                statusText: response.statusText,
            },
            'Incoming HTTP response from Medical network',
        );

        return response;
    }
    private onRequestError(error: any): Promise<never> {
        this.logger.error({ error }, 'Request error in Medical network');
        return Promise.reject(error);
    }


    private onResponseError(error: any): Promise<never> {
        this.logger.error(
            {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            },
            'Response error in Medical network'
        );


        if (error.response?.status === HttpStatus.UNAUTHORIZED) {
            this.logger.warn('Access token expired, will refresh on next request');
            this.accessToken = null;
            this.tokenExpiry = null;
        }

        return Promise.reject(error);
    }

  }