import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/core/abstract';
import { Clinic } from '@/core/models';


@Injectable()
export class ClinicRepository extends BaseRepository<Clinic> {

    constructor() {
        super(Clinic);
    }
}