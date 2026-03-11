import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '@/modules/user/repository';
import { GuardianWardsRepository } from '@/modules/user/repository/guardian-wards.repository';
import { UserExceptions } from '@/exceptions/message.exception';
import { Transaction } from 'sequelize';
import { GuardianWard } from '@/core/models';


@Injectable()
export class GuardianWardsService {


    constructor(
        private readonly userRepository: UserRepository,
        private readonly guardianWardsRepository: GuardianWardsRepository,

    ) {}



    async create(guardianId: number, wardId: number, transaction?: Transaction): Promise<GuardianWard> {
       await this.findRelationOrThrow(guardianId, wardId);
        return await this.guardianWardsRepository.create({guardianId, wardId }, {transaction});
    }

    async calculateGuardian(wardId:number, transaction?: Transaction): Promise<number> {
        return await this.guardianWardsRepository.count({
            where: {
                wardId,
            },
            transaction
        })
    }

    async findWardRelations( wardId: number, transaction?: Transaction): Promise<GuardianWard[]> {
        return  await this.guardianWardsRepository.findAllByOptions({
            where: {
                wardId,

            },
            include:this.guardianWardsRepository.buildInclude(),
             transaction
        });


    }

    async findRelationOrThrow(guardianId: number, wardId: number): Promise<void> {
        const relation = await this.guardianWardsRepository.findOneByOptions({
            where: {
                guardianId,
                wardId,

            },
           
        });

        if (relation) {
            throw new BadRequestException(UserExceptions.GUARDIAN_WARD_ALREADY_EXISTS)
        }
    }

    async findGuardianWards(guardianId: number, transaction?: Transaction): Promise<GuardianWard[]> {
        return await this.guardianWardsRepository.findAllByOptions({
            where: {
                guardianId,

            },
            transaction
        })
    }

 async delete(guardianId:number, wardId: number, transaction?: Transaction): Promise<number> {
        return await this.guardianWardsRepository.delete({where:{
            wardId,
            guardianId
      }, transaction})
 }
 

}