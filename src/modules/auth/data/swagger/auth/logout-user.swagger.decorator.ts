import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { schemaUnauthorizedForSwagger } from '@/utils/data/types';
import { OkeResponse } from '@/modules/auth/data/swagger/auth/types';

export function SwaggerDecoratorByLogout(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Logout user' }),
        ApiCreatedResponse({
            type: OkeResponse,
        }),
        ApiUnauthorizedResponse({
            schema: schemaUnauthorizedForSwagger,
        }),
    );
}

