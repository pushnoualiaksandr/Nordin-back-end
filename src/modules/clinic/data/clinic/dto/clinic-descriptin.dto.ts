import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BlocksDto {
    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    highlight?: string;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subText?: string[];
}

export class ClinicDescriptionDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    fact?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    facts?: string[];

    @IsOptional()
    @IsString()
    subtitle?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BlocksDto)
    blocks?: BlocksDto[];
}