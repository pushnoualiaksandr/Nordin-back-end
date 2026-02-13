import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@/core/models';
import { UserController } from '@/modules/user/controllers/user.controller';
import { UserRepository } from '@/modules/user/repository';
import { UserService } from '@/modules/user/services/user.service';
import { ClinicModule } from '@/modules/clinic/clinic.module';


@Module({
    imports: [ SequelizeModule.forFeature([User], ),ClinicModule],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [ UserService]
})

export class UserModule {}