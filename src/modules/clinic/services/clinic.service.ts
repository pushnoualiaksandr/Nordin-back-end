import { Injectable, NotFoundException } from '@nestjs/common';
import { ClinicRepository } from '@/modules/clinic/repository';
import { CreateClinicDto, UpdateClinicDto } from '@/modules/clinic/data/clinic/dto';
import { Clinic } from '@/core/models';
import { Transaction } from 'sequelize';
import { ClinicExceptions } from '@/exceptions/message.exception';


@Injectable()
export class ClinicService {
  constructor( private readonly clinicRepository: ClinicRepository) {
  }

  async createClinic(dto: CreateClinicDto): Promise<Clinic> {
      return await this.clinicRepository.create(dto);
  }

    async updateClinic(id: number, dto: UpdateClinicDto): Promise<Clinic> {
      console.log('clinic=>', dto)
     const clinic = await this.clinicRepository.findById(id);
      await clinic.update(

          {
            ...dto
         });
        return await this.clinicRepository.findById(id);
    }

    async findAllClinic(transaction?: Transaction): Promise<Clinic[]> {
      const clinic = await this.clinicRepository.findAllByOptions({transaction});
      if (!clinic) {
          throw new NotFoundException(ClinicExceptions.CLINIC_NOT_FOUND)
      }
      return  clinic
    }

}