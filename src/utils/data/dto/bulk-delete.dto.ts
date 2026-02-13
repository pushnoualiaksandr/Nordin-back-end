import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class BulkDeleteDto {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsUUID('4', { each: true })
    ids: string[];
}
