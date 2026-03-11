import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { schemaNotFoundForSwagger } from '@/utils/data/types';
import { VerifyPassCodeResponse } from '@/modules/auth/data/swagger/pass-code/types';


export function SwaggerDecoratorPassCodeDisable(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Pass code disable' }),
        ApiOkResponse({
            type: VerifyPassCodeResponse,
        }),
            ApiBadRequestResponse({
            schema: schemaNotFoundForSwagger,
        }),
    );
}