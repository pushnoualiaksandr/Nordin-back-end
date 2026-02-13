import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthResponse } from '@/modules/auth/data/swagger/types';
import { schemaBadRequestForSwagger, schemaNotFoundForSwagger, schemaUnauthorizedForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorDateOfBirth(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Login' }),
        ApiOkResponse({
            type: AuthResponse ,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
        ApiNotFoundResponse({
        schema: schemaNotFoundForSwagger,
        }),
        ApiUnauthorizedResponse({
            schema: schemaUnauthorizedForSwagger
        })
    );
    }