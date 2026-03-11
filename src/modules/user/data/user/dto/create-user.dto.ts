import {
    IsBoolean,
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@/utils/data/enums/Gender';
import { Role } from '@/utils/data/enums/Role';
import { UserStatus } from '@/utils/data/enums/UserStatus';
import { PHONE_NUMBER_REGEX } from '@/utils/data/const';

export class CreateUserDto {
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

    @ApiProperty({
        description: "User\'s gender",
        enum: Gender,
        example: Gender.MALE
    })
    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;

    @ApiProperty({
        description: 'Phone number in international format',
        example: '375291234567',
        pattern: '^\\[1-9]\\d{1,14}$'
    })
    @IsNotEmpty()
    @IsString()
    @Matches(PHONE_NUMBER_REGEX, {
        message: 'The phone number must be in the international format, for example: 375291234567'
    })
    phone: string;

    @ApiPropertyOptional({
        description: 'External user ID (MIS ID)',
        example: '1',

    })
    @IsNotEmpty()
    @IsNumber()
    misId: number;

    @ApiPropertyOptional({
        description: 'The URL of the user\'s avatar',
        example: 'https://example.com/avatar.jpg',
        maxLength: 500
    })
    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @ApiPropertyOptional({
        description: 'Date of birth in the format YYYY-MM-DD',
        example: '1990-01-15',
        format: 'date'
    })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @ApiPropertyOptional({
        description: 'Статус пользователя',
        enum: UserStatus,
        example: UserStatus.UNVERIFIED,
        default: UserStatus.UNVERIFIED
    })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus = UserStatus.UNVERIFIED;

    @ApiPropertyOptional({
        description: "User\'s email address",
        example: 'user@example.com',
        format: 'email'
    })
    @IsOptional()
    @IsEmail()
    email?: string;


    @IsOptional()
    @IsEnum(Role)
    role?: Role = Role.PATIENT;

    @ApiPropertyOptional({
        description: 'A sign of coming of age',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean()
    isAdult?: boolean = true;

    @ApiPropertyOptional({
        description: 'Are notifications enabled?',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean()
    isNotificationsEnabled?: boolean = true;


}