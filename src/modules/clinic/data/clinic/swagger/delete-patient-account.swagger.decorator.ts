import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
    schemaBadRequestForSwagger,
    schemaNotFoundForSwagger,
    schemaSuccessResponseForSwagger
} from '@/utils/data/types';

export function SwaggerDecoratorByDeleteUserAccount(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user account' }),
    ApiCreatedResponse({
      schema: schemaSuccessResponseForSwagger,
    }),
      ApiBadRequestResponse({
      schema: schemaBadRequestForSwagger,
    }),
      ApiNotFoundResponse({
          schema: schemaNotFoundForSwagger
      })
  );
}