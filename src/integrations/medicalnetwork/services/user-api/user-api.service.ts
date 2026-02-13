import { Injectable } from '@nestjs/common';
import { MedicalNetworkBaseApiService } from '@/integrations/medicalnetwork/services/medicalnetwork-base-api.service';
import { catchError, lastValueFrom, map, retry } from 'rxjs';
import { AxiosError } from 'axios';
import { UserApiResponse } from '@/integrations/medicalnetwork/services';


@Injectable()
export class UserApiService extends MedicalNetworkBaseApiService {
    private readonly apiUrl ='/mobile'


    getUser(phone: string, ): Promise<UserApiResponse> {
        const path = this.apiUrl + `/patient/exist`;
        const request$ = this.http.get<UserApiResponse>(path, {
            headers: {
                phone,
                cipher:11
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