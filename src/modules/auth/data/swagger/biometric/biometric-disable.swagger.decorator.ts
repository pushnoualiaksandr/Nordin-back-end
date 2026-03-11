import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { schemaNotFoundForSwagger } from '@/utils/data/types';
import { BiometricDisableResponse } from '@/modules/auth/data/swagger/biometric/types';


export function SwaggerDecoratorBiometricDisable(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Biometric registration' }),
        ApiOkResponse({
            type: BiometricDisableResponse,
        }),
        ApiBadRequestResponse({
            schema: schemaNotFoundForSwagger,
        }),

    );
}