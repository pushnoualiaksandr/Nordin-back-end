import { Verification } from '@/core/models';
import { BaseRepository } from '@/core/abstract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyRepository extends BaseRepository<Verification> {
    constructor() {
        super(Verification);
    }
}