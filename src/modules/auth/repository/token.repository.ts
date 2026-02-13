import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/core/abstract';
import { Token, } from '@/core/models';


@Injectable()
export class TokenRepository extends BaseRepository<Token> {

    constructor() {
        super(Token);
    }


}