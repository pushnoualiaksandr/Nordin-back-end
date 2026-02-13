import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MedicalNetworkBaseApiService, } from '@/integrations/medicalnetwork/services/medicalnetwork-base-api.service';
import { UserApiService } from '@/integrations/medicalnetwork/services';
import { SmsApiService } from '@/integrations/medicalnetwork/services/sms-api/sms-api.service';

@Module({
    imports: [HttpModule.register({})],
    controllers: [],
    providers: [
        MedicalNetworkBaseApiService,
        UserApiService,
        SmsApiService
    ],
    exports: [
        UserApiService,
        SmsApiService
    ],
})
export class MedicalNetworkModule {}