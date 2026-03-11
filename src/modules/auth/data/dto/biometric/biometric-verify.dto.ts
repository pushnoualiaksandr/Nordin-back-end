import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BiometricVerifyDto {

    @ApiProperty({ example: 'a7d8f9e3b2c1...' })
    @IsString()
    @IsNotEmpty()
    challenge: string;

    @ApiProperty({ example: 'a7d8f9e3b2c1...' })
    @IsString()
    @IsNotEmpty()
    signature: string;
}