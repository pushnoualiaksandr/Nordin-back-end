import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SignUpDto } from '@/modules/auth/data/dto/auth';

export class CreateWardDto  extends SignUpDto {

    @ApiPropertyOptional({
        description: "User\'s sms code",
        example: '1111',
        format: 'email'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'The code must contain at least 4 characters.' })
    @MaxLength(4, { message: 'The code should not exceed 4 characters.' })
    code: string;

    @ApiPropertyOptional({
        description: 'A sign of coming of age',
        example: true,
        default: true
    })
    @IsNotEmpty()
    @IsBoolean()
    isAdult: boolean;

}