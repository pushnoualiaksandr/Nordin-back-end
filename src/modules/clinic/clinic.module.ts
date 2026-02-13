import { Module } from '@nestjs/common';
import { ClinicRepository, ClinicUserRepository } from '@/modules/clinic/repository';
import { ClinicService, ClinicUserService } from '@/modules/clinic/services';
import { ClinicController } from '@/modules/clinic/controllers';
import { SequelizeModule } from '@nestjs/sequelize';
import { Clinic, ClinicUser } from '@/core/models';


@Module({
    imports: [ SequelizeModule.forFeature([Clinic,  ClinicUser])],
    controllers: [ClinicController],
    providers: [ClinicRepository, ClinicService, ClinicUserService, ClinicUserRepository],
    exports: [ClinicService, ClinicUserService]
})

export class ClinicModule {}