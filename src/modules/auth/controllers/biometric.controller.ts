import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/core/guard/jwt-auth.guard';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { User } from '@/core/models';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import {
    SwaggerDecoratorBiometricRegistration
} from '@/modules/auth/data/swagger/biometric/biometric-registr.swagger.decorator';
import { BiometricService } from '@/modules/auth/services/biometric.service';
import { BiometricRegisterDto, BiometricVerifyDto } from '@/modules/auth/data/dto/biometric';
import {
    SwaggerDecoratorBiometricVerify
} from '@/modules/auth/data/swagger/biometric/biometric-verify.swagger.decorator';
import { AuthResponseType } from '@/utils/data/types/auth-response.type';
import {
    SwaggerDecoratorBiometricDisable
} from '@/modules/auth/data/swagger/biometric/biometric-disable.swagger.decorator';
import {
    SwaggerDecoratorBiometricChallenge,
} from '@/modules/auth/data/swagger/biometric/biometric-challenge.swagger.decorator';


@ApiTags('Biometric')
@Controller('auth/biometric')
export class BiometricController {
    constructor(private readonly biometricService: BiometricService) {}

    @SwaggerDecoratorBiometricRegistration()
    @UseGuards(JwtAuthGuard)
    @Post('registration')
    async biometricRegistration(
        @CurrentUser() user: User,
        @Body() dto: BiometricRegisterDto,
    ):  Promise<ResponseMessageDto> {
        return this.biometricService.registerBiometric(user, dto);
    }
    @SwaggerDecoratorBiometricVerify()
    @UseGuards(JwtAuthGuard)
    @Post('verify')
    async biometricVerify(
        @CurrentUser('id') id: number,
        @Body() dto: BiometricVerifyDto,
    ):  Promise<AuthResponseType> {
        return this.biometricService.verifyBiometric(id, dto);
    }

    @SwaggerDecoratorBiometricDisable()
    @UseGuards(JwtAuthGuard)
    @Post('disable')
    async biometricDisable(
        @CurrentUser() user: User,
       ): Promise<ResponseMessageDto>{
        return this.biometricService.disableBiometric(user);
    }

@SwaggerDecoratorBiometricChallenge()
@UseGuards(JwtAuthGuard)
    @Get('challenge')
    async generateChallenge(
        @CurrentUser('id') id: number,
    ): Promise<{ challenge: string }> {
        return this.biometricService.generateChallenge(id);
    }

}