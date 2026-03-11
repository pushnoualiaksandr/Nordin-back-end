import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BiometricChallengeeResponse } from '@/modules/auth/data/swagger/biometric/types'; // импортируем класс

export function SwaggerDecoratorBiometricChallenge() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Generate biometric challenge' }),
        ApiOkResponse({
            description: 'Challenge generated successfully',
            type: BiometricChallengeeResponse
        }),
    );
}