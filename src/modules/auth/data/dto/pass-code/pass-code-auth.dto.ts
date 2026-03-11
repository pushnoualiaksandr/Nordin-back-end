import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PasscodeAuthDto {
    @ApiProperty({ example: 'a7d8f9e3b2c1...', description: 'Хеш пароля' })
    @IsString()
    passcode: string;
}