import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/core/abstract';
import { GuardianWard, User } from '@/core/models';
import { Includeable } from 'sequelize';


@Injectable()
export class GuardianWardsRepository extends BaseRepository<GuardianWard> {

    constructor() {
        super(GuardianWard);
    }

    buildInclude(): Includeable[] {
        return [
           {
                model: User,
                as: 'guardian',
                attributes: ['misId'],

            }
        ];
    }


}