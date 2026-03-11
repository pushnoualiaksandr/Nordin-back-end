import { ApiProperty } from '@nestjs/swagger';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';

export class VerifyPassCodeResponse {
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