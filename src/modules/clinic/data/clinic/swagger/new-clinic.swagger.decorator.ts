import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { schemaBadRequestForSwagger } from '@/utils/data/types/schemaBadRequestForSwagger';
import { Clinic } from '@/core/models';

export function SwaggerDecoratorCreateClinic(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Create new clinic. Only admin!' }),
        ApiCreatedResponse({
           type: Clinic,
        }),
        ApiBadRequestResponse({
           schema: schemaBadRequestForSwagger,
        }),
    );
}

