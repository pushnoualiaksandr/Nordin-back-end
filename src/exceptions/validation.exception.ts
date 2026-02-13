import { HttpException, HttpStatus } from '@nestjs/common';

type ValidationResponse = string | string[] | Record<string, unknown> | Record<string, unknown>[];

export class ValidationException extends HttpException {
    constructor(response: ValidationResponse) {
        super(
            {
                validationMessage: response,
                message: 'Validation error',
                status: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
