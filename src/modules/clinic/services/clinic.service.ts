import { Injectable } from '@nestjs/common';
import { ClinicRepository } from '@/modules/clinic/repository';
import { CreateClinicDto, UpdateClinicDto } from '@/modules/clinic/data/clinic/dto';
import { Clinic } from '@/core/models';
import { Transaction } from 'sequelize';


@Injectable()
export class ClinicService {
  constructor( private readonly clinicRepository: ClinicRepository) {
  }

  async createClinic(dto: CreateClinicDto): Promise<Clinic> {
      return await this.clinicRepository.create(dto);
  }

    async updateClinic(id: number, dto: UpdateClinicDto): Promise<Clinic> {
      await this.clinicRepository.update(
          {
            where: {id},

         },
          {
            ...dto
         });
        return await this.clinicRepository.findById(id);
    }

    async findAllClinic(transaction?: Transaction): Promise<Clinic[]> {
      return await this.clinicRepository.findAllByOptions({transaction})
    }

}