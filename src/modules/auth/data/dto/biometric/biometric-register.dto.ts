import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BiometricRegisterDto {

    @ApiProperty({ example: 'a7d8f9e3b2c1...' })
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    publicKey: string;

    @ApiProperty({ example: 'a7d8f9e3b2c1...' })
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    deviceId: string;
}