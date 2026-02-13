import { PartialType } from '@nestjs/swagger';
import { CreateClinicDto } from '@/modules/clinic/data/clinic/dto/create-clinic.dto';

export class UpdateClinicDto extends PartialType(CreateClinicDto) {}