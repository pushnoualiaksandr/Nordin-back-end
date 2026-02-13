import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { schemaBadRequestForSwagger } from '@/utils/data/types/schemaBadRequestForSwagger';
import { User } from '@/core/models';

export function SwaggerDecoratorDeleteAccount(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Delete a user account' }),
        ApiCreatedResponse({
            type: User,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
    );
}