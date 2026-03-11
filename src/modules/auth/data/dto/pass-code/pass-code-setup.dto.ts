import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PasscodeSetupDto {
    @ApiProperty({ example: 'a7d8f9e3b2c1...', description: 'Хеш пароля' })
    @IsString()
    passcode: string;

    @ApiProperty({ example: '5f4d8a2e...', description: 'Соль для хеширования' })
    @IsString()
    salt: string;
}