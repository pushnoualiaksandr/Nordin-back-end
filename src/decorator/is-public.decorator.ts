import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic' as const;

export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
