import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { VerifyCodeResponse } from '@/modules/auth/data/swagger/types';
import { schemaBadRequestForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorVerifyCode(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Verify code' }),
        ApiOkResponse({
            type: VerifyCodeResponse,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
    );
}