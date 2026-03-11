import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PHONE_NUMBER_REGEX } from '@/utils/data/const';

export class UpdateUserDto {
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

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isCodPass?: boolean;


    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isFaceId?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isNotificationsEnabled?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isProcessingPersonalData?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isPrivacyPolicy?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isEmailNewsLetter?: boolean;


    @ApiPropertyOptional({
        description: "User\'s email address",
        example: 'user@example.com',
        format: 'email'
    })
    @IsOptional()
    @IsEmail()
    email?: string;


}