import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { AuthResponse } from '@/modules/auth/data/swagger/types';
import { schemaBadRequestForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorBySignUp(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Registration confirm user' }),
        ApiCreatedResponse({
        type: AuthResponse,
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            schema: schemaBadRequestForSwagger,
        }),
    );
}