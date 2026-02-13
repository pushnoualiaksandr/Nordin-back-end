import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { schemaBadRequestForSwagger } from '@/utils/data/types/schemaBadRequestForSwagger';
import { User } from '@/core/models';

export function SwaggerDecoratorUpdateUser(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Update user' }),
        ApiOkResponse({
          type: User,
        }),
        ApiBadRequestResponse({
          schema: schemaBadRequestForSwagger,
        }),
    );
}