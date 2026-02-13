import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/core/abstract';
import { Clinic, ClinicUser, User } from '@/core/models';
import { Includeable } from 'sequelize';


@Injectable()
export class ClinicUserRepository extends BaseRepository<ClinicUser> {

    constructor() {
        super(ClinicUser);
    }

    buildInclude(): Includeable[] {
        return [

            {
                model: Clinic,
                as: 'clinic',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: []
            },

            {
                model: User,
                as: 'user',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: []
            },

        ];
    }
}