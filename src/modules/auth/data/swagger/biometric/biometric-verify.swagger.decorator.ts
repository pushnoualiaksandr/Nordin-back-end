import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { schemaForbiddenForSwagger, schemaNotFoundForSwagger } from '@/utils/data/types';
import { AuthResponse } from '@/modules/auth/data/swagger/auth/types';


export function SwaggerDecoratorBiometricVerify(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Biometric verify' }),
        ApiOkResponse({
            type: AuthResponse,
        }),
        ApiUnauthorizedResponse({
            schema: schemaForbiddenForSwagger,
        }),
        ApiNotFoundResponse({
            schema: schemaNotFoundForSwagger,
        }),
    );
}