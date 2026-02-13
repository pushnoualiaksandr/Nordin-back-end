import { IsBoolean, IsEmail, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/utils/data/enums/Gender';
import { PHONE_NUMBER_REGEX } from '@/utils/data/const';

export class SignUpDto {
    @ApiProperty({ type: 'string', example: 'Ivan' })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ type: 'string', example: 'Ivanov' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ type: 'string', example: 'Ivanov' })
    @IsOptional()
    @IsString()
    patronymic?: string;

    @ApiProperty({ type: 'string', example: 'male' })
    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;


    @ApiProperty({ type: 'string', example: '1990-11-02' })
    @IsNotEmpty()
    @IsISO8601()
    dateOfBirth: Date;

    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    @Matches(PHONE_NUMBER_REGEX)
    phone: string;

    @ApiProperty({ type: 'string', example: 'example@gmail.com' })
    @IsOptional()
    @IsEmail()
    email?: string;


    @ApiProperty({ type: 'boolean', example: true })
    @IsNotEmpty()
    @IsBoolean()
    isProcessingPersonalData: boolean;

    @ApiProperty({ type: 'boolean', example: true })
    @IsNotEmpty()
    @IsBoolean()
    isPrivacyPolicy: boolean;

    @ApiProperty({ type: 'boolean', example: true })
    @IsNotEmpty()
    @IsBoolean()
    isEmailNewsLetter: boolean;
}
