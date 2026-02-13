import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/services';
import { TokenService, VerifyService } from '@/modules/auth/services';
import { TokenBaseService } from '@/utils/modules/token/token-base.service';
import { getRandom4DigitNumber } from '@/utils/data/functions/getRandom4DigitNumber';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { isUser18OrOlder } from '@/utils/data/functions/checkUser18OrOlder';
import { ClinicService, ClinicUserService } from '@/modules/clinic/services';
import { UserApiService } from '@/integrations/medicalnetwork/services';
import { User, Verification } from '@/core/models';
import { AuthExceptions } from '@/core/exception';
import { CheckDateOfBirthQuery } from '@/modules/auth/data/query';
import { SignUpDto } from '@/modules/auth/data/dto/auth';
import { UserStatus } from '@/utils/data/enums/UserStatus';
import { Role } from '@/utils/data/enums/Role';
import { Sequelize } from 'sequelize-typescript';
import { SmsApiService } from '@/integrations/medicalnetwork/services/sms-api/sms-api.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly verifyService:VerifyService,
        private readonly tokenBaseService: TokenBaseService,
        private readonly clinicService: ClinicService,
        private readonly clinicUserService: ClinicUserService,
        private readonly userApiService:UserApiService,
         private readonly smsApiService:SmsApiService,
         @Inject(Sequelize) private readonly sequelize: Sequelize,
   ) {}



async checkUserExists( phone: string) {

       try {
           const user = await this.userService.findOneUserByPhone(phone);
           const patient = await this.userApiService.getUser(phone)

           if (!patient.exist && !user) {
              return {isRegistration: true,  isTokenValid: true};
           }

           if (!user && patient.exist) {
               const {code} = await this.verify(phone)

               return {isRegistration: true,  isTokenValid: true, code};
           }
           const tokenData = await this.tokenService.findTokenByUserId(user.id);
           const isTokenValid = await this.tokenService.isTokenInvalid(user.id);
           const code = getRandom4DigitNumber();
           tokenData.code = code;
           await tokenData.save({fields:['code']});
           console.log('token=>', isTokenValid);

           //   если user не прошел регистрацию на ресепшене то меняем ему статус UserStatus.UNVERIFIED

           console.log('code=>', code);
           return { isRegistration: false, isTokenValid};
       } catch (error) {
           throw new HttpException(
               error.message || 'Alvaris service error',
               error.status || HttpStatus.BAD_GATEWAY
           );
       }


}


  async registration(dto:SignUpDto) {
      const transaction = await this.sequelize.transaction();
      const {phone, gender, isEmailNewsLetter} = dto;

      try {
          await this.verifyService.validateVerification(phone);

          const [newPatient, clinics] = await Promise.all([
              this.userService.createUser({
                  phone,
                  gender,
                  status: UserStatus.VERIFIED,
                  isNotificationsEnabled: isEmailNewsLetter || false,
                  isAdult: true,
                  role: Role.PATIENT,
              }, transaction ),
              this.clinicService.findAllClinic( transaction ),
          ]);

          await Promise.all([
              this.clinicUserService.createClinicUser(clinics[0].id, newPatient.id, transaction ),
              this.tokenService.create({ userId: newPatient.id }, transaction ),
              this.verifyService.deleteByAuthField(phone, transaction ),
          ]);

          const {accessToken, refreshToken } = await  this.generateTokens(newPatient.id);

          await transaction.commit();

          return {
              user: newPatient,
              clinic: clinics[0],
              accessToken,
              refreshToken,
          }
          // запрос в альварис
      } catch (error) {
          await transaction.rollback();
          throw error;
      }
 }



    async verifyCode(phone: string, code: string) {
        const patient = await this.userService.findOneUserByPhone(phone);
        if (!patient) {
            await this.verifyService.verifyAndConfirmCode(phone, code);
            return {
                isTokenValid: true,
                isRegistration: true,
                clinic: null,
                user: null,
                refreshToken: null,
                accessToken: null,
            }
        }
        await this.tokenService.verifyCode(code, patient.id)
       return  await  this.generateTokensAndUserData(patient)
    }


4

    async verify( phone: string ): Promise<{code: string, candidate: Verification}> {
        await this.verifyService.verifyLastRequestTime(phone);
        const code = getRandom4DigitNumber();
        const now = new Date().getTime();
        const candidate = await this.verifyService.createOrUpdate(phone,now, code);
        return { code , candidate};
        // тут оправим запрос на получение SMS пользователю
        //return new ResponseMessageDto(AuthExceptions.SMS_SENT, true);
    }

  async checkDateOfBirth( {phone, dateOfBirth}:CheckDateOfBirthQuery ) {

      const date= '1990-01-01'
      if (date !== dateOfBirth) {
          throw new BadRequestException(AuthExceptions.WRONG_DATE_OF_BIRTH);
      }
      const user = await  this.userService.findUserByPhoneOrThrow(phone);
      const { id } = user;
      const clinicUser = await this.clinicUserService.findClinicByUserId(id);
          const {accessToken, refreshToken } = await  this.generateTokens(id);

      await this.tokenService.saveRefreshToken(id, refreshToken);
      return  {
          ...clinicUser,
          accessToken,
          refreshToken,

      }

  }

    async generateTokensAndUserData( user: User)  {
        const { id } = user;
        const isTokenValid = await this.tokenService.isTokenInvalid(id);

        if (!isTokenValid) {
            return {
                isTokenValid: false,
                isRegistration: false,
                clinic: null,
                user: null,
                refreshToken: null,
                accessToken: null,
            }
        }
        const clinicUser = await this.clinicUserService.findClinicByUserId(id);
        const {accessToken, refreshToken } = await  this.generateTokens(id);

        await this.tokenService.saveRefreshToken(id, refreshToken);

        return {
            ...clinicUser,
            accessToken,
            refreshToken,
            isTokenValid,
            isRegistration: false
        };
    }


   async refresh(userId: number) {
        const clinicUser = await this.clinicUserService.findClinicByUserId(userId);
       const {accessToken, refreshToken } = await  this.generateTokens(userId);
        return {
            ...clinicUser,
            accessToken,
            refreshToken,
        };
    }

    async logout(userId: number): Promise<ResponseMessageDto> {
       await this.tokenService.removeRefreshToken(userId)
        return new ResponseMessageDto('ok', true);
    }


    private checkUserAge(birthdate: Date) {
        const result = isUser18OrOlder(birthdate)

        if (!result) {
          throw new BadRequestException('Registration is prohibited for users under 18');
        }
    }
    private async generateTokens(userId: number) {

        const accessToken = this.tokenBaseService.generateAccessToken({userId});
        const refreshToken = this.tokenBaseService.generateRefreshToken({userId});

        await this.tokenService.saveRefreshToken(userId, refreshToken);

        return {

            accessToken,
            refreshToken,
        }
    }


  }