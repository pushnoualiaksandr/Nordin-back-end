import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';

export const ToBooleanTransformer = (): PropertyDecorator => {
    return Transform((params: TransformFnParams) => {
        if (params.value === undefined || params.value === null) {
            return false;
        }

        if (params.value === 'true' || params.value === '1' || params.value === 1 || params.value === true) {
            return true;
        } else if (params.value === 'false' || params.value === '0' || params.value === 0 || params.value === false) {
            return false;
        }

        throw new BadRequestException({ field: params.key, message: 'Invalid value (boolean string is expected)' });
    });
};
