import { Injectable } from '@nestjs/common';
import { MedicalNetworkBaseApiService } from '@/integrations/medicalnetwork/services/medicalnetwork-base-api.service';
import { catchError, lastValueFrom, map, retry } from 'rxjs';
import { AxiosError } from 'axios';
import {
    CreateWardType,
    DeleteWardType,
    IOkResponse,
    UserApiResponse,
    UserCreateRequest
} from '@/integrations/medicalnetwork/services';


@Injectable()
export class UserApiService extends MedicalNetworkBaseApiService {
    private readonly apiUrl ='/mobile/patient'


    getPatient(phone: string, cipher:string): Promise<UserApiResponse> {
        const path = this.apiUrl + `/exist`;
        const request$ = this.http.get<UserApiResponse>(path, {
            headers: {
                phone,
                cipher
            }
        }).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }

    createPatient(body: UserCreateRequest): Promise<UserApiResponse> {
        const path = this.apiUrl + `/create`;
        const request$ = this.http.post<UserApiResponse>(path, body).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }
    changePatient(body: UserCreateRequest, cipher: string ): Promise<IOkResponse> {
        const path = this.apiUrl + `/change`;
        const request$ = this.http.post<IOkResponse>(path, {...body , cipher}).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }

    createWard(body: CreateWardType): Promise<IOkResponse> {
        const path = this.apiUrl + `/child/create`;

        const request$ = this.http.post<IOkResponse>(path, body).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }


    deleteWard(body: DeleteWardType): Promise<IOkResponse> {
        const path = this.apiUrl + `/child/delete`;
         const request$ = this.http.post<IOkResponse>(path, body).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }



    getPatientAvatar( misId: number, avatarKey: string): Promise<ArrayBuffer> {
        const path = this.apiUrl + `/photo/${avatarKey}_${misId}`;
        const request$ = this.http.get<ArrayBuffer>(path, {
            responseType:'arraybuffer',
        }).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }

    getPatientAvatarUrl( misId: number, avatarKey: string): Promise<{url: string}> {
        const path = this.apiUrl + `/photourl/${avatarKey}_${misId}`;
        const request$ = this.http.get<{url: string}>(path).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }




    uploadPatientAvatar(misId: number, avatarKey: string, file?: Express.Multer.File): Promise<{update: boolean}> {
        const path = this.apiUrl + `/photo/update`;
        const request$ = this.http.post<{update: boolean}>(path, file?.buffer ||'', {
            headers: {
                'Content-Type': file?.mimetype || '',
                'Content-Length': file?.size || '',
                guid: avatarKey,
                id: misId
            }
        }).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }

    deletePatientAvatar(misId: number, avatarKey: string): Promise<{update: boolean}> {
        console.log(misId, avatarKey)
        const path = this.apiUrl + `/photo/update`;
        const request$ = this.http.post<{update: boolean}>(path, {}, {
            headers: {
                guid: avatarKey,
                id: misId
            }
        }).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }
}