import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { schemaBadRequestForSwagger } from '@/utils/data/types/schemaBadRequestForSwagger';
import { User } from '@/core/models';

export function SwaggerDecoratorUnAssignWard(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Un assign ward' }),
        ApiOkResponse({
            type: User,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
    );
}