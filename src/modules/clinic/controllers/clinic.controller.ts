import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClinicService, ClinicUserService } from '@/modules/clinic/services';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerDecoratorCreateClinic, SwaggerDecoratorUpdateClinic } from '@/modules/clinic/data/clinic/swagger';
import { CreateClinicDto } from '@/modules/clinic/data/clinic/dto';
import { Clinic } from '@/core/models';
import { UpdateClinicDto } from '@/modules/clinic/data/clinic/dto/';
import {
    SwaggerDecoratorByDeleteUserAccount
} from '@/modules/clinic/data/clinic/swagger/delete-patient-account.swagger.decorator';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';


@ApiTags('Clinic')
@Controller('clinic')
export class ClinicController {
    constructor(
        private readonly clinicService: ClinicService,
        private readonly clinicUserService: ClinicUserService

    ) {}
       @SwaggerDecoratorCreateClinic()
       @Post()
        create(@Body() body: CreateClinicDto): Promise<Clinic> {
         return   this.clinicService.createClinic(body)
       }

       @SwaggerDecoratorUpdateClinic()
       @Patch('/:id')
      update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateClinicDto): Promise<Clinic> {
         return  this.clinicService.updateClinic(id, body )
       }

       @SwaggerDecoratorByDeleteUserAccount()
       @Delete(':clinicId/remove-account/:userId')
      delete(@Param('clinicId', ParseIntPipe) clinicId: number,@Param('userId', ParseIntPipe) userId: number ): Promise<ResponseMessageDto> {
        return  this.clinicUserService.deleteUserAccount(clinicId, userId)
       }
    }
