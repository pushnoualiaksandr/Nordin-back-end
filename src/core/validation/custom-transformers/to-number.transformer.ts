import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';

export const ToNumberTransformer = (): PropertyDecorator => {
    return Transform((params: TransformFnParams) => {
        if (params.value === undefined || params.value === null) {
            return false;
        }

        try {
            if (Array.isArray(params.value) && params.value.length > 0) {
                return params.value.map(Number);
            }

            return Number(params.value);
        } catch (err) {
            throw new BadRequestException({ field: params.key, message: 'Invalid value (numeric string is expected)' });
        }
    });
};
