import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { PHONE_NUMBER_REGEX } from '@/utils/data/const';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRulesDto {
    @ApiProperty({
        description: 'Array of allowed routes for user type 1',
        type: [String],
        example: ['/patients', '/appointments', '/reports']
    })
    @IsArray({ message: 'Field 1 must be an array' })
    @IsString({ each: true, message: 'Each item in field 1 must be a string' })
    1: string[];

    @ApiProperty({
        description: 'Array of allowed routes for user type 2 (optional)',
        type: [String],
        required: false,
        example: ['/dashboard', '/settings']
    })
    @IsOptional()
    @IsArray({ message: 'Field 2 must be an array if provided' })
    @IsString({ each: true, message: 'Each item in field 2 must be a string' })
    2?: string[];

    @ApiProperty({
        description: 'Array of allowed routes for user type 3 (optional)',
        type: [String],
        required: false,
        example: ['/billing', '/invoices']
    })
    @IsOptional()
    @IsArray({ message: 'Field 3 must be an array if provided' })
    @IsString({ each: true, message: 'Each item in field 3 must be a string' })
    3?: string[];

    @ApiProperty({
        description: 'Array of allowed routes for user type 4 (optional)',
        type: [String],
        required: false,
        example: ['/analytics', '/exports']
    })
    @IsOptional()
    @IsArray({ message: 'Field 4 must be an array if provided' })
    @IsString({ each: true, message: 'Each item in field 4 must be a string' })
    4?: string[];
}

export class CreateClinicDto {
    @ApiProperty({
        description: 'Name of the clinic',
        example: 'City Medical Center',
        minLength: 2,
        maxLength: 100
    })
    @IsNotEmpty({ message: 'Clinic name is required' })
    @IsString({ message: 'Clinic name must be a string' })
    name: string;

    @ApiProperty({
        description: 'City where the clinic is located',
        example: 'Minsk',
        minLength: 2,
        maxLength: 50
    })
    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    city: string;

    @ApiProperty({
        description: 'Street address of the clinic',
        example: 'Surganova Street 47B',
        minLength: 3,
        maxLength: 200
    })
    @IsNotEmpty({ message: 'Street address is required' })
    @IsString({ message: 'Street address must be a string' })
    street: string;

    @ApiProperty({
        description: 'Array of clinic phone numbers',
        type: [String],
        example: ['375445060159', '375335060159', '375255060159'],
        minItems: 1
    })
    @IsNotEmpty({ message: 'At least one phone number is required' })
    @IsString({ each: true, message: 'Each phone number must be a string' })
    @IsArray({ message: 'Phones must be provided as an array' })
    @ArrayMinSize(1, { message: 'At least one phone number is required' })
    @Matches(PHONE_NUMBER_REGEX, {
        each: true,
        message: 'Each phone must be in format 375XXXXXXXXX with valid operator code (25, 29, 33, 44, 17)'
    })
    phones: string[];

    @ApiProperty({
        description: 'Short/internal phone number (optional)',
        example: '159',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'Short phone must be a string if provided' })
    shortPhone?: string;

    @ApiProperty({
        description: 'Authorization rules for different user types',
        type: AuthRulesDto,
        example: {
            1: ['/home', '/appointments'],
            2: ['/dashboard'],
            3: ['/news'],
            4: ['/documents']
        }
    })
    @IsNotEmpty({ message: 'Authorization rules are required' })
    @ValidateNested({
        each: true,
        message: 'Each auth rule must be a valid object'
    })
    @Type(() => AuthRulesDto)
    authRules: AuthRulesDto;
}