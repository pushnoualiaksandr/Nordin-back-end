import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/utils/data/enums/Gender';
import { DATE_REGEX, PHONE_NUMBER_REGEX } from '@/utils/data/const';

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

    @ApiProperty({
        description: 'Full name of the user (full name)',
        example: 'Ivanov Ivan Ivanovich',
        minLength:5,
        maxLength: 150
    })
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'The full name must contain at least 3 characters.' })
    @MaxLength(150, { message: 'The name should not exceed 150 characters.' })
    fio?: string;

    @ApiProperty({ type: 'string', example: 'male' })
    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;


    @ApiProperty({ type: 'string', example: '12.11.1990' })
    @IsNotEmpty()
    @IsString()
    @Matches(DATE_REGEX, { message: 'Date must be in format DD.MM.YYYY' })
    dateOfBirth: string;

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
