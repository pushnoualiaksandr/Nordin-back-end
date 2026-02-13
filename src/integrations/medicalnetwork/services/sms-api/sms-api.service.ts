import { Injectable } from '@nestjs/common';
import { MedicalNetworkBaseApiService } from '@/integrations/medicalnetwork/services/medicalnetwork-base-api.service';
import { catchError, lastValueFrom, map, retry } from 'rxjs';
import { AxiosError } from 'axios';
import { SmsResponseType, SmsValidateType } from '@/integrations/medicalnetwork/services/sms-api/types';


@Injectable()
export class SmsApiService extends MedicalNetworkBaseApiService {
    private readonly apiUrl ='/mobile'


    sendSms(phone: string, ): Promise<SmsResponseType> {
        const path = this.apiUrl + `/code4sms`;
        const request$ = this.http.post<SmsResponseType>(path, {
            phone
        }).pipe(
            map((res) => res.data),
            retry({
                delay: (err, i) => this.retryCallback(err, i),
            }),
            catchError((err: AxiosError) => this.handleError(err)),
        );

        return lastValueFrom(request$);
    }

    checkSmsCode(phone: string, code: string): Promise<SmsValidateType > {
        const path = this.apiUrl + `/code4/validate`;
        const request$ = this.http.get<SmsValidateType >(path, {
            headers: {
                phone,
                code
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