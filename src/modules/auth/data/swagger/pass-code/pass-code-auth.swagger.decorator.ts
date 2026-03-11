import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { schemaNotFoundForSwagger, schemaUnauthorizedForSwagger } from '@/utils/data/types';
import { AuthResponse } from '@/modules/auth/data/swagger/auth/types';


export function SwaggerDecoratorPassCodeAuth(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Pass code auth' }),
        ApiOkResponse({
            type: AuthResponse,
        }),
        ApiUnauthorizedResponse({
            schema: schemaUnauthorizedForSwagger,
        }),
        ApiNotFoundResponse({
            schema: schemaNotFoundForSwagger,
        }),
    );
}