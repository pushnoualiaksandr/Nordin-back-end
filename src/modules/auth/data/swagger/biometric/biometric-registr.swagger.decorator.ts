import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { schemaNotFoundForSwagger } from '@/utils/data/types';
import { BiometricRegistrationResponse } from '@/modules/auth/data/swagger/biometric/types';


export function SwaggerDecoratorBiometricRegistration(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Biometric registration' }),
        ApiOkResponse({
            type: BiometricRegistrationResponse,
        }),
        ApiBadRequestResponse({
            schema: schemaNotFoundForSwagger,
        }),

    );
}