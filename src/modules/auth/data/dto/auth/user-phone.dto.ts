import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PHONE_NUMBER_REGEX } from '@/utils/data/const';

export class UserPhoneDto {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    @Matches(PHONE_NUMBER_REGEX)
    readonly phone: string;

}