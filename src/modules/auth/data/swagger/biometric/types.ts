import { ApiProperty } from '@nestjs/swagger';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';

export class BiometricRegistrationResponse {
    @ApiProperty({
        description: 'Biometric registration',
        example: {
            message: 'ok',
            success: true,
            statusCode: 200
        },
        type: ResponseMessageDto
    })
    response: ResponseMessageDto;
}

export class BiometricDisableResponse {
    @ApiProperty({
        description: 'Biometric disable',
        example: {
            message: 'ok',
            success: true,
            statusCode: 200
        },
        type: ResponseMessageDto
    })
    response: ResponseMessageDto;
}
export class BiometricChallengeeResponse {
    @ApiProperty({
        description: 'Challenge string for biometric authentication',
        example: 'K3vXm9pQ2rT5wY8zB6nL4sH7fJ1kD0cA',
    })
    challenge: string;

}