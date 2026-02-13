import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { schemaBadRequestForSwagger } from '@/core/decorator/types-for-swagger/schema.bad.request.for.swagger';
import { schemaBadRequestInCodeForSwagger } from '@/core/decorator/types-for-swagger/schema.bad.request.in.code.for.swagger';
import { schemaUnauthorizedForSwagger } from '@/core/decorator/types-for-swagger/schema.unauthorized.for.swagger';

export function SwaggerDecoratorBySignUp(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Registration confirm user' }),

        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            schema: schemaBadRequestForSwagger,
        }),
    );
}

export function SwaggerDecoratorBySignIn(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Registration confirm user' }),

        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            schema: schemaBadRequestInCodeForSwagger,
        }),
    );
}

export function SwaggerDecoratorByVerify(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Registration confirm user' }),

        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            schema: schemaBadRequestForSwagger,
        }),
    );
}

export function SwaggerDecoratorResendCall(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Registration confirm user' }),

        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            schema: schemaBadRequestForSwagger,
        }),
    );
}

export function SwaggerDecoratorByVerifyCode(): MethodDecorator {
    return applyDecorators(
        ApiOperation({ summary: 'Registration confirm user' }),

        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            schema: schemaBadRequestForSwagger,
        }),
    );
}

export function SwaggerDecoratorByLogout(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Logout user' }),

        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            schema: schemaUnauthorizedForSwagger,
        }),
    );
}

export function SwaggerDecoratorByRefreshToken(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Refresh token' }),

        ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            schema: schemaUnauthorizedForSwagger,
        }),
    );
}
