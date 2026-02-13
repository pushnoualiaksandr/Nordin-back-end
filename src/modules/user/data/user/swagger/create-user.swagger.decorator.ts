import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { schemaBadRequestForSwagger } from '@/utils/data/types/schemaBadRequestForSwagger';
import { User } from '@/core/models';

export function SwaggerDecoratorCreateUser(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Create new user' }),
        ApiCreatedResponse({
          type: User,
        }),
        ApiBadRequestResponse({
          schema: schemaBadRequestForSwagger,
        }),
    );
}