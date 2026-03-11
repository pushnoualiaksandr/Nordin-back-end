import { BaseQuery } from '@/utils/data/dto/BaseQuery';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class GetAvatarQuery extends  BaseQuery{
    @ApiPropertyOptional({
        description: 'External user ID (MIS ID)',
        example: '1',

    })
    @IsNotEmpty()
    @IsString()
    misId: string;

    @ApiPropertyOptional({
        example: 'dsd-dsd32-ccx',

    })
    @IsNotEmpty()
    @IsString()
    avatarKey: string;
}