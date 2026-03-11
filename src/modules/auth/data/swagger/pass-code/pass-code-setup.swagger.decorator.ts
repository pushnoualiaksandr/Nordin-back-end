import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { schemaBadRequestForSwagger, schemaNotFoundForSwagger } from '@/utils/data/types';
import { VerifyPassCodeResponse } from '@/modules/auth/data/swagger/pass-code/types';


export function SwaggerDecoratorPassCodeSetup(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Pass code setup' }),
        ApiOkResponse({
            type: VerifyPassCodeResponse,
        }),
        ApiBadRequestResponse({
            schema: schemaNotFoundForSwagger,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
    );
}