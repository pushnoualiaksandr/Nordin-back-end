import { Injectable, NotFoundException } from '@nestjs/common';
import { ClinicUserRepository } from '@/modules/clinic/repository/clinic-user.repository';
import { ClinicUser } from '@/core/models';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { AuthExceptions } from '@/core/exception';
import { UserExceptions } from '@/exceptions/message.exception';
import { Transaction } from 'sequelize';


@Injectable()
export class ClinicUserService {
    constructor( private readonly clinicUserRepository: ClinicUserRepository) {
    }

    async createClinicUser(clinicId: number, userId: number, transaction?: Transaction): Promise<ClinicUser> {
        await  this.clinicUserRepository.create({clinicId, userId}, {transaction});
        return await this.findOneByUserIdClinicId(userId, clinicId, transaction);

    }

    async deleteUserAccount(clinicId: number, userId: number): Promise<ResponseMessageDto>  {
       const patient = await this.findOneByUserIdClinicId(userId, clinicId);
       await patient.destroy();
       return new ResponseMessageDto(UserExceptions.USER_DELETED, true)
    }

    async findOneByUserIdClinicId(userId: number, clinicId: number, transaction?: Transaction): Promise<ClinicUser> {
        const patient = await this.clinicUserRepository.findOneByOptions({where:
            {userId, clinicId},
            include: this.clinicUserRepository.buildInclude(),
            transaction
        });

        if (!patient) {
        throw new NotFoundException(AuthExceptions.USER_NOT_FOUND)
        }

        return patient;
    }
    async findClinicByUserId(userId: number): Promise<ClinicUser> {
       const patient = await this.clinicUserRepository.findOneByOptions({
            where:{userId},
            include: this.clinicUserRepository.buildInclude(),
            attributes: {
               exclude: ['createdAt', 'updatedAt','userId', 'clinicId'],
           },
        })
        if (!patient) {
            throw new NotFoundException(AuthExceptions.USER_NOT_FOUND)
        }
        return patient.toJSON();
    }

}