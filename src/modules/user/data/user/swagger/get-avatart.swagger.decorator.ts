import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { schemaNotFoundForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorGetAvatar(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Get patient avatar' }),
        ApiResponse({
            type: ArrayBuffer,
        }),
        ApiBadRequestResponse({
            schema: schemaNotFoundForSwagger,
        }),

    );
}