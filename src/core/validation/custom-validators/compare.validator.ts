import { ClassConstructor } from 'class-transformer';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

export const Compare = <T>(
    type: ClassConstructor<T>,
    property: (o: T) => unknown,
    validationOptions?: ValidationOptions,
) => {
    return (object: unknown, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
};

@ValidatorConstraint({ name: 'Compare' })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: unknown, args?: ValidationArguments): boolean {
        const [fn] = args.constraints;
        return fn(args.object) === value;
    }

    defaultMessage(args?: ValidationArguments): string {
        const [constraintProperty]: (() => unknown)[] = args.constraints;
        return `${constraintProperty} and ${args.property} does not match`;
    }
}
