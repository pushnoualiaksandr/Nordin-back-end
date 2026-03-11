import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from '@/modules/auth/services';
import { SignUpDto, UserPhoneDto } from '@/modules/auth/data/dto/auth';
import {
    SwaggerDecoratorByAddWard,
    SwaggerDecoratorByLogout,
    SwaggerDecoratorByRefreshToken,
    SwaggerDecoratorCheckUser,
    SwaggerDecoratorUnAssignWard,
    SwaggerDecoratorVerifyCode
} from '@/modules/auth/data/swagger';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { PhoneCodeVerifyDto } from '@/modules/auth/data/dto/auth/verify-code.dto';
import { TokensResponse } from '@/modules/auth/data/swagger/auth/types';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { JwtAuthGuard } from '@/core/guard/jwt-auth.guard';
import { JwtRefreshGuard } from '@/core/guard/jwt-refresh.guard';
import { User } from '@/core/models';
import { SwaggerDecoratorBySignUp } from '@/modules/auth/data/swagger/auth/sign-up.swagger.decorator';
import { CheckDateOfBirthQuery } from '@/modules/auth/data/query';
import {
    SwaggerDecoratorCheckDateOfBirth
} from '@/modules/auth/data/swagger/auth/check-date-of-birth.swagger.decorator';
import { CreateWardDto } from '@/modules/user/data/user/dto';
import { WardService } from '@/modules/auth/services/ward.service';
import { AuthResponseType } from '@/utils/data/types/auth-response.type';


@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly wardService: WardService) {}


    @SwaggerDecoratorCheckUser()
    @Post('send-code')
    sendSmsCode(@Body() {phone}: UserPhoneDto): Promise<ResponseMessageDto> {
        return  this.authService.sendSmsCode(phone);
    }

    @SwaggerDecoratorVerifyCode()
    @Post('verify-code')
      verifyRegistrationCode(@Body() {phone, code} :PhoneCodeVerifyDto): Promise<AuthResponseType>{
        return this.authService.verifyCodeWithLogin(phone, code);
  }

    @SwaggerDecoratorVerifyCode()
    @Post('check-code')
    verifyCode(@Body() {phone, code} :PhoneCodeVerifyDto): Promise<ResponseMessageDto>{
        return this.authService.verifyCode(phone, code);
    }


  @SwaggerDecoratorCheckDateOfBirth()
  @Get('check-date-of-birth')
  checkDateOfBirth(@Query() query: CheckDateOfBirthQuery): Promise<AuthResponseType> {
        return this.authService.checkDateOfBirth(query)
  }
    @SwaggerDecoratorBySignUp()
    @Post()
        registration(@Body() body: SignUpDto): Promise<AuthResponseType>{
           return this.authService.registration(body)
    }

     @SwaggerDecoratorByRefreshToken()
   @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@CurrentUser() user: User): Promise<TokensResponse> {
        return this.authService.refresh(+user.id);
    }

    @SwaggerDecoratorByLogout()
    @UseGuards(JwtAuthGuard)
    @Delete('logout')
    async logout(
       @CurrentUser('id') userId: string,
    ): Promise<ResponseMessageDto> {
        return this.authService.logout(+userId);
    }

    @SwaggerDecoratorByAddWard()
    @UseGuards(JwtAuthGuard)
    @Post('ward')
    async addWard(
        @CurrentUser('id') userId: string,
        @Body() body: CreateWardDto
    ): Promise<User> {
        return this.wardService.createWard(+userId, body);
    }

    @SwaggerDecoratorUnAssignWard()
    @UseGuards(JwtAuthGuard)
    @Delete('ward/:wardId')
    unAssignWard(@Param('wardId', ParseIntPipe) wardId: number,   @CurrentUser('id') userId: string,):  Promise<ResponseMessageDto>  {
        return this.wardService.deleteWard( wardId, +userId)
    }

}

