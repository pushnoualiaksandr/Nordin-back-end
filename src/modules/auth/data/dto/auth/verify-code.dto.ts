import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserPhoneDto } from './user-phone.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneCodeVerifyDto extends UserPhoneDto  {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(4)
    readonly code: string;
}