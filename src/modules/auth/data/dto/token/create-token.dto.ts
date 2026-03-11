import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTokenDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsString()
    cipher?: string;

    @IsOptional()
    @IsString()
    refreshToken?: string;

    @IsOptional()
    @IsString()
     fcmToken?: string[];


    @IsOptional()
    @IsDate()
    refreshTokenExpiresAt?: Date
}