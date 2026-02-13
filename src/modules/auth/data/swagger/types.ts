import { ApiProperty } from '@nestjs/swagger';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { ClinicUser } from '@/core/models';


export class CheckExistUserResponse {
    @ApiProperty({ type: 'string' })
    code: string;
}

export class VerifyCodeResponse {
    @ApiProperty({
        description: 'Check code result',
        example: {
            message: 'ok',
            success: true,
            statusCode: 200
        },
        type: ResponseMessageDto
    })
    response: ResponseMessageDto;
}

export class TokensResponse {
    @ApiProperty({ type: 'string' })
    accessToken: string;

    @ApiProperty({ type: 'string' })
    refreshToken: string;
}

export class AuthResponse extends TokensResponse {
    @ApiProperty({ type: ClinicUser })
    clinicUser:ClinicUser;
}

export class CheckDateOfBirthResponse {
    @ApiProperty({
        description: 'Check date of birth',
        example: {
            message: 'ok',
            success: true,
            statusCode: 200
        },
        type: ResponseMessageDto
    })
    response: ResponseMessageDto;
}