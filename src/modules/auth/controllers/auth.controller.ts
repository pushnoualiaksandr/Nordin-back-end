import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from '@/modules/auth/services';
import { SignUpDto, UserPhoneDto } from '@/modules/auth/data/dto/auth';
import {
    SwaggerDecoratorByLogout,
    SwaggerDecoratorByRefreshToken,
    SwaggerDecoratorCheckUser,
    SwaggerDecoratorVerifyCode
} from '@/modules/auth/data/swagger';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { PhoneCodeVerifyDto } from '@/modules/auth/data/dto/auth/verify-code.dto';
import { TokensResponse } from '@/modules/auth/data/swagger/types';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { JwtAuthGuard } from '@/core/guard/jwt-auth.guard';
import { JwtRefreshGuard } from '@/core/guard/jwt-refresh.guard';
import { User } from '@/core/models';
import { SwaggerDecoratorBySignUp } from '@/modules/auth/data/swagger/sign-up.swagger.decorator';
import { CheckDateOfBirthQuery } from '@/modules/auth/data/query';
import { SwaggerDecoratorCheckDateOfBirth } from '@/modules/auth/data/swagger/check-date-of-birth.swagger.decorator';


@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @SwaggerDecoratorCheckUser()
    @Post('check-registration')
    checkRegistrationUser(@Body() {phone}: UserPhoneDto) {
        return  this.authService.checkUserExists(phone);
    }

    @SwaggerDecoratorVerifyCode()
    @Post('verify-code')
      verifyRegistrationCode(@Body() {phone, code} :PhoneCodeVerifyDto){
        return this.authService.verifyCode(phone, code);
  }

  @SwaggerDecoratorCheckDateOfBirth()
  @Get('check-date-of-birth')
  checkDateOfBirth(@Query() query: CheckDateOfBirthQuery) {
        return this.authService.checkDateOfBirth(query)
  }
    @SwaggerDecoratorBySignUp()
    @Post()
        registration(@Body() body: SignUpDto){
           return this.authService.registration(body)
    }

     @SwaggerDecoratorByRefreshToken()
   @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@CurrentUser() user: User): Promise<TokensResponse> {
        console.log('id=>', user);
        return this.authService.refresh(+user.id);
    }

    @SwaggerDecoratorByLogout()
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(
       @CurrentUser('id') userId: string,
    ): Promise<ResponseMessageDto> {
        return this.authService.logout(+userId);
    }
}

