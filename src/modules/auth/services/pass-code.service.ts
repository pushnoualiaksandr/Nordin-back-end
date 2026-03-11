import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '@/modules/user/services';
import { PasscodeAuthDto, PasscodeSetupDto } from '@/modules/auth/data/dto/pass-code';
import { AuthExceptions } from '@/core/exception';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { TokenService } from '@/modules/auth/services/token.service';
import { AuthResponseType } from '@/utils/data/types/auth-response.type';
import { AuthService } from '@/modules/auth/services/auth.service';


@Injectable()
export class PasscodeService {



    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly authService: AuthService
    ){}

    async setupPasscode(userId: number, dto: PasscodeSetupDto): Promise<ResponseMessageDto> {
        const user =  await this.userService.findOneUserById(userId);
         const token =  await  this.tokenService.findTokenByUserId(userId)
   

        if (token.codePassHash) {
            throw new BadRequestException(AuthExceptions.PASSCODE_ALREADY_EXISTS);
        }

        await token.update({codePassHash: dto.passcode})
        await user.update({isCodPass: true});

        return new ResponseMessageDto('ok', true)

    }



async authPasscode(userId: number, dto: PasscodeAuthDto): Promise<AuthResponseType> {
  const token = await this.tokenService.findTokenByUserId(userId);
  
  if (!token.codePassHash) {
    throw new NotFoundException(AuthExceptions.PASSCODE_NOT_FOUND);
  }


console.log('dto.passcode=>',dto.passcode)
    console.log('token=>',token.codePassHash)
    console.log('valid=>',token.codePassHash !== dto.passcode)
   // const isValid = await bcrypt.compare(dto.passcode, token.codePassHash);

    if (token.codePassHash !== dto.passcode) {
        console.log('POPALI!')
    throw new ForbiddenException(AuthExceptions.PASSCODE_INVALID);
  }
  
  return await this.authService.refresh(userId);
}

   async disablePasscode(userId: number): Promise<ResponseMessageDto> {
        const user = await this.userService.findOneUserById(userId);
        const token =  await  this.tokenService.findTokenByUserId(userId);
        await token.update({ code: null });
        await user.update({isCodPass: false});
        return new ResponseMessageDto('ok', true)
    }

}