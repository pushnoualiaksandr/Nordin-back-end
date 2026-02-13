import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { ToNumberTransformer } from '@/core/validation/custom-transformers/to-number.transformer';

export class BaseQuery {
    @IsOptional()
    @ToNumberTransformer()
    @IsNumber()
    @IsPositive()
    readonly page?: number;

    @IsOptional()
    @ToNumberTransformer()
    @IsNumber()
    @IsPositive()
    take?: number;

    @IsOptional()
    readonly sort?: string;

    @IsOptional()
    @IsIn(['DESC', 'desc', 'ASC', 'asc'])
    readonly asc?: string;

    @IsOptional()
    readonly q?: string;
}
