import { ArgumentMetadata, Injectable, Logger, Optional, PipeTransform } from '@nestjs/common';
import { ClassTransformOptions, instanceToPlain, plainToInstance } from 'class-transformer';
import { isObject, validate, ValidationError, ValidatorOptions } from 'class-validator';
import { iterate } from 'iterare';
import { ValidationException } from 'src/exceptions/validation.exception';
import { isNotEmptyArray } from 'src/utils/data/functions/validateArray';
import { isNil } from 'src/utils/data/functions/validatePrimitive';

type ParsedError = {
    field: string;
    message: string;
};

interface ValidationPipeOptions extends ValidatorOptions {
    transform?: boolean;
    transformOptions?: ClassTransformOptions;
    validateCustomDecorators?: boolean;
}

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
    private readonly logger = new Logger(ValidationPipe.name);
    private readonly isTransformEnabled: boolean;
    private readonly transformOptions: ClassTransformOptions;
    private readonly validatorOptions: ValidatorOptions;
    private readonly validateCustomDecorators: boolean;

    constructor(@Optional() options?: ValidationPipeOptions) {
        options = options || {};
        const { transform, transformOptions, validateCustomDecorators, ...validatorOptions } = options;

        this.isTransformEnabled = !!transform;
        this.transformOptions = transformOptions;
        this.validatorOptions = validatorOptions;
        this.validateCustomDecorators = validateCustomDecorators || false;
    }

    async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
        const metatype = metadata.metatype;
        if (!metatype || !this.toValidate(metadata)) {
            return this.isTransformEnabled ? this.transformPrimitive(value, metadata) : value;
        }

        const originalValue = value;
        value = this.toEmptyIfNil(value);

        const isNil = value !== originalValue;
        const isPrimitive = this.isPrimitive(value);

        this.stripProtoKeys(value as Record<string, never>);

        let object = plainToInstance(metatype, value, this.transformOptions);

        const originalEntity = object;
        const isCtorNotEqual = object.constructor !== metatype;

        if (isCtorNotEqual && !isPrimitive) {
            object.constructor = metatype;
        } else if (isCtorNotEqual) {
            object = { constructor: metatype };
        }

        const errors = await this.validate(object, this.validatorOptions);

        if (isNotEmptyArray(errors)) {
            throw new ValidationException(this.getMessages(errors));
        }

        if (isPrimitive) {
            object = originalEntity;
        }

        if (this.isTransformEnabled) {
            return object;
        }

        if (isNil) {
            return originalValue;
        }

        return Object.keys(this.validatorOptions).length > 0 ? instanceToPlain(object, this.transformOptions) : value;
    }

    private stripProtoKeys(value: Record<string, never>): void {
        delete value.__proto__;

        const keys = Object.keys(value);
        iterate(keys)
            .filter((key) => isObject(value[key]) && value[key])
            .forEach((key) => this.stripProtoKeys(value[key]));
    }

    private isPrimitive(value: unknown): boolean {
        return ['number', 'boolean', 'string'].includes(typeof value);
    }

    private transformPrimitive(value: unknown, metadata: ArgumentMetadata): unknown {
        if (!metadata.data) {
            return value;
        }

        const { type, metatype } = metadata;
        if (type !== 'param' && type !== 'query') {
            return value;
        }

        if (metatype === Boolean) {
            return value === true || value === 'true';
        }

        if (metatype === Number) {
            return +value;
        }

        return value;
    }

    private toEmptyIfNil<T = unknown>(value: T): T | Record<string, never> {
        return isNil(value) ? {} : value;
    }

    private validate(
        object: object,
        validatorOptions?: ValidatorOptions,
    ): Promise<ValidationError[]> | ValidationError[] {
        return validate(object, validatorOptions);
    }

    private getMessages(errors: ValidationError[], parentProperty?: string): ParsedError[] {
        if (!isNotEmptyArray(errors)) {
            return [];
        }

        let messages: ParsedError[] = [];

        errors.forEach((err) => {
            if (err.constraints) {
                messages = messages.concat(
                    Object.keys(err.constraints).map((key) => ({
                        field: parentProperty ? `${err.property}.${parentProperty}` : err.property,
                        message: err.constraints[key],
                    })),
                );
            }

            if (isNotEmptyArray(err.children)) {
                messages = messages.concat(this.getMessages(err.children, err.property));
            }
        });

        this.logger.error(ValidationPipe.name, messages);

        return messages;
    }

    private toValidate(metadata: ArgumentMetadata): boolean {
        const { metatype, type } = metadata;

        if (type === 'custom' && !this.validateCustomDecorators) {
            return false;
        }

        const types = [String, Boolean, Number, Array, Object, Buffer];
        return !types.some((t) => metatype === t) && !isNil(metatype);
    }
}
