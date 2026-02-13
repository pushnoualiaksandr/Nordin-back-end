import { IsNotEmpty, IsString } from 'class-validator';
import { UserPhoneDto } from '../dto/auth/user-phone.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CheckDateOfBirthQuery extends UserPhoneDto  {
    @ApiProperty({ type: 'string' })
    @IsNotEmpty()
    @IsString()
    readonly dateOfBirth: string;
    }
