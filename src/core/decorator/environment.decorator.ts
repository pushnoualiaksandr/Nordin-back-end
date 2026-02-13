import { SetMetadata } from '@nestjs/common';

export const ENVIRONMENT_KEY = 'environment' as const;

export const Environment = (
    ...environments: string[]
): ((target: object, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => void) =>
    SetMetadata(ENVIRONMENT_KEY, environments);
