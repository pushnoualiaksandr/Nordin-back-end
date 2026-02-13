import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CheckExistUserResponse } from '@/modules/auth/data/swagger/types';
import { schemaBadRequestForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorCheckUser(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Find user' }),
        ApiOkResponse({
              type: CheckExistUserResponse,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
    );
}

