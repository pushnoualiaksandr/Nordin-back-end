import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { OkeResponse } from '@/modules/auth/data/swagger/auth/types';
import { schemaBadRequestForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorVerifyCode(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Verify code' }),
        ApiOkResponse({
            type: OkeResponse,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
    );
}