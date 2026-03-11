import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@/core/models';
import { UserController } from '@/modules/user/controllers/user.controller';
import { UserRepository } from '@/modules/user/repository';
import { UserService } from '@/modules/user/services/user.service';
import { ClinicModule } from '@/modules/clinic/clinic.module';
import { MedicalNetworkModule } from '@/integrations/medicalnetwork/medical-network.module';
import { GuardianWardsService } from '@/modules/user/services/guardian-wards.service';
import { GuardianWardsRepository } from '@/modules/user/repository/guardian-wards.repository';


@Module({
    imports: [ SequelizeModule.forFeature([User], ),ClinicModule, MedicalNetworkModule,  ],
    controllers: [UserController],
    providers: [UserRepository, UserService, GuardianWardsService, GuardianWardsRepository],
    exports: [ UserService, GuardianWardsService, ]
})

export class UserModule {}