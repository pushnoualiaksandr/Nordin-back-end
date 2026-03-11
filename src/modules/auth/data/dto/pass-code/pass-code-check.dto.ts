import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PasscodeCheckDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    @IsNumber()
    userId: number;

    @ApiProperty({ example: 'a7d8f9e3b2c1...', description: 'Хеш пароля для проверки' })
    @IsString()
    passcodeHash: string;
}