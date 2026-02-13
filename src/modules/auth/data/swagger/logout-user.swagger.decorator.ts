import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { VerifyCodeResponse } from '@/modules/auth/data/swagger/types';
import { schemaUnauthorizedForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorByLogout(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Logout user' }),
        ApiCreatedResponse({
            type: VerifyCodeResponse,
        }),
        ApiUnauthorizedResponse({
            schema: schemaUnauthorizedForSwagger,
        }),
    );
}