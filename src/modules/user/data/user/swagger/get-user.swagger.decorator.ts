import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, } from '@nestjs/swagger';
import { schemaBadRequestForSwagger } from '@/utils/data/types/schemaBadRequestForSwagger';
import { User } from '@/core/models';
import { schemaNotFoundForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorGetUser(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Get user' }),
        ApiResponse({
            type:  User,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
        ApiNotFoundResponse({
            schema: schemaNotFoundForSwagger,
        }),
    );
}