import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/core/abstract';
import { Token, User } from '@/core/models';
import { Includeable } from 'sequelize';


@Injectable()
export class UserRepository extends BaseRepository<User> {

    constructor() {
        super(User);
    }
    buildInclude(): Includeable[] {
        return [
            {
                model: Token,
                as: 'tokens',

            },
            {
                model: User,
                as: 'wards',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              
            }
        ];
    }

}