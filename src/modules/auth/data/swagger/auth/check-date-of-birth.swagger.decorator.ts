import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CheckDateOfBirthResponse } from '@/modules/auth/data/swagger/auth/types';
import { schemaBadRequestForSwagger } from '@/utils/data/types';

export function SwaggerDecoratorCheckDateOfBirth(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Check date of birth' }),
        ApiOkResponse({
            type: CheckDateOfBirthResponse,
        }),
        ApiBadRequestResponse({
            schema: schemaBadRequestForSwagger,
        }),
    );
}
