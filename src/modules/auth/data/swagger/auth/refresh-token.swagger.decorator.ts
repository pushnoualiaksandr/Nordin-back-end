import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { TokensResponse } from '@/modules/auth/data/swagger/auth/types';
import { schemaUnauthorizedForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorByRefreshToken(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Refresh token' }),
        ApiCreatedResponse({
            type: TokensResponse,
        }),
        ApiUnauthorizedResponse({
              schema: schemaUnauthorizedForSwagger,
        }),
    );
}