import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/core/guard/jwt-auth.guard';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { User } from '@/core/models';
import { Throttle } from '@nestjs/throttler';
import { PasscodeService } from '@/modules/auth/services/pass-code.service';
import { PasscodeAuthDto, PasscodeSetupDto } from '@/modules/auth/data/dto/pass-code';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { AuthResponseType } from '@/utils/data/types/auth-response.type';
import { SwaggerDecoratorPassCodeAuth } from '@/modules/auth/data/swagger';
import {
    SwaggerDecoratorPassCodeDisable
} from '@/modules/auth/data/swagger/pass-code/pass-code-disable.swagger.decorator';
import { SwaggerDecoratorPassCodeSetup } from '@/modules/auth/data/swagger/pass-code/pass-code-setup.swagger.decorator';

@ApiTags('Pass code')
@Controller('auth/passcode')
export class PasscodeController {
    constructor(private readonly passcodeService: PasscodeService) {}

    @SwaggerDecoratorPassCodeSetup()
    @UseGuards(JwtAuthGuard)
    @Post('setup')
    async setupPasscode(
        @CurrentUser() user: User,
        @Body() dto: PasscodeSetupDto,
    ):  Promise<ResponseMessageDto> {
        return this.passcodeService.setupPasscode(user.id, dto);
    }

    @SwaggerDecoratorPassCodeAuth()
    @UseGuards(JwtAuthGuard)
    @Post('auth')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    async authPasscode(
        @CurrentUser() user: User,
        @Body() dto: PasscodeAuthDto,
    ): Promise<AuthResponseType> {
        return this.passcodeService.authPasscode(user.id, dto);
    }

    @SwaggerDecoratorPassCodeDisable()
    @UseGuards(JwtAuthGuard)
    @Delete('disable')
    async disablePasscode(
        @CurrentUser() user: User,
    ):  Promise<ResponseMessageDto>{
        return this.passcodeService.disablePasscode(user.id);
    }

}