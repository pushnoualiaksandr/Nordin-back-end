import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { schemaBadRequestForSwagger } from '@/utils/data/types/schemaBadRequestForSwagger';
import { Clinic } from '@/core/models';

export function SwaggerDecoratorUpdateClinic(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Update clinic. Only admin!' }),
        ApiBadRequestResponse({
            type: Clinic,
        }),
        ApiOkResponse({
         schema: schemaBadRequestForSwagger,
        }),
    );
}