import { BadGatewayException, BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/services';
import { TokenService } from '@/modules/auth/services';
import { TokenBaseService } from '@/utils/modules/token/token-base.service';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { ClinicService, ClinicUserService } from '@/modules/clinic/services';
import { UserApiService } from '@/integrations/medicalnetwork/services';
import { User } from '@/core/models';
import { AuthExceptions } from '@/core/exception';
import { CheckDateOfBirthQuery } from '@/modules/auth/data/query';
import { SignUpDto } from '@/modules/auth/data/dto/auth';
import { UserStatus } from '@/utils/data/enums/UserStatus';
import { Role } from '@/utils/data/enums/Role';
import { Sequelize } from 'sequelize-typescript';
import { SmsApiService } from '@/integrations/medicalnetwork/services/sms-api/sms-api.service';
import { Gender } from '@/utils/data/enums/Gender';
import { AuthResponseType } from '@/utils/data/types/auth-response.type';
import { Transaction } from 'sequelize';
import { createMD5Hash } from '@/utils/data/functions/createMD5Hash';
import { VerifyService } from '@/modules/auth/services/verification.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly tokenBaseService: TokenBaseService,
        private readonly clinicService: ClinicService,
        private readonly clinicUserService: ClinicUserService,
        private readonly userApiService:UserApiService,
        private readonly smsApiService:SmsApiService,
        private readonly verifyService:VerifyService,
        @Inject(Sequelize) private readonly sequelize: Sequelize,
   ) {}


    async sendSmsCode(phone: string): Promise<ResponseMessageDto> {
       const res = await this.smsApiService.sendSms(phone);

        if (res.send) {
            return new ResponseMessageDto('ok', true);
        } else {
            throw new BadGatewayException(AuthExceptions.SMS_SERVICE_UNAVAILABLE);
        }
    }

    async verifyCode(phone: string, code: string): Promise<ResponseMessageDto> {
        const result = await this.smsApiService.checkSmsCode(phone,code)
        if (!result.validate) {
            throw new BadRequestException(AuthExceptions.CODE_NOT_CORRECT);
        }
        return new ResponseMessageDto('ok', true);
    }


    async verifyCodeWithLogin(phone: string, code: string): Promise<AuthResponseType>  {
      await this.verifyCode(phone,code)

       const user  = await this.userService.findOneUserByPhone(phone);

      console.log('user',user)
        if (!user) {
          const hash = createMD5Hash(phone, code);

          const now = new Date().getTime();
          await this.verifyService.createOrUpdate(phone, now, hash, code);
          return {
              isTokenValid: false,
              isRegistration: true,
              clinic: null,
              user: null,
              refreshToken: null,
              accessToken: null,
          }
        }

        const patient = await this.userApiService.getPatient(phone, user.tokens.cipher);

        if (user && !patient?.exist) {
            await user.destroy()
           new BadRequestException(AuthExceptions.TRY_AGAIN);
        }
        if (user && patient?.exist) {
            const {user: userData, ...rest} =  await  this.generateTokensAndUserData(user);
            const token = await this.tokenService.findTokenByUserId(user.id);
            token.code = code;
            await token.save({fields: ['code']});
            return {
                ...rest,
               user: await this.userService.getCombinedUser(user, patient)

            }
        }
    }



    async registration(dto: SignUpDto): Promise<AuthResponseType> {
        return this.sequelize.transaction(async (transaction) => {
            const {dateOfBirth, isEmailNewsLetter, firstName, lastName, patronymic, email, ...rest } = dto;
            const candidate = await this.verifyService.findVerification(dto.phone, transaction);

            if (!candidate) {
                throw new BadRequestException(AuthExceptions.VERIFICATION_NOT_FOUND);
            }

            const userFromDb = await this.userService.findOneUserByPhone(dto.phone, transaction);

            if (userFromDb) {
                throw new BadRequestException(AuthExceptions.ALREADY_REGISTERED)
            }

          const patient = await this.userService.getOrCreatePatientInMis(dto, candidate.cipher, candidate.code, true);
          console.log('patient=>',patient)
            const [newPatient, clinics] = await Promise.all([
                this.userService.createUser({
                    ...rest,
                    status: UserStatus.VERIFIED,
                    isNotificationsEnabled: isEmailNewsLetter || false,
                    isAdult: true,
                    misId: patient.id,
                    role: Role.PATIENT,
                },true, transaction),
                this.clinicService.findAllClinic(transaction),
            ]);


            await Promise.all([
                this.clinicUserService.createClinicUser(clinics[0].id, newPatient.id, transaction),
                this.tokenService.create({ userId: newPatient.id , cipher: candidate.cipher }, transaction),
            ]);
            const user  = await this.userService.findOneUserByPhone(dto.phone, transaction);
            console.log('user=>',user)

            await this.verifyService.deleteByAuthField(dto.phone);
            const { accessToken, refreshToken } = await this.generateTokens(newPatient.id, transaction);

            return {
                user: await this.userService.getCombinedUser(user, patient),
                clinic: clinics[0],
                accessToken,
                refreshToken,
            };
        });
    }


    async checkDateOfBirth(
        { phone, dateOfBirth }: CheckDateOfBirthQuery,
    ): Promise<AuthResponseType> {
        return this.sequelize.transaction(async (transaction) => {
            let user = await this.userService.findOneUserByPhone(phone);
            const patient = await this.userApiService.getPatient(phone, user?.tokens.cipher);

            if (!patient.exist) {
                throw new BadRequestException(AuthExceptions.USER_NOT_FOUND);
            }

            if (patient.birthday !== dateOfBirth) {
                throw new BadRequestException(AuthExceptions.WRONG_DATE_OF_BIRTH);
            }


            const clinics = await this.clinicService.findAllClinic(transaction);


            if (!user) {
                user = await this.userService.createUser(
                    {
                        phone,
                        status: patient.mob_confirmed
                            ? UserStatus.VERIFIED
                            : UserStatus.UNVERIFIED,
                        misId: patient.id,
                        gender: Gender.MALE,
                        isNotificationsEnabled: false,
                        isAdult: true,
                        role: Role.PATIENT,
                    },
                    true,
                    transaction,
                );

             await Promise.all([
                    this.clinicUserService.createClinicUser(
                        clinics[0].id,
                        user.id,
                        transaction,
                    ),
                    this.tokenService.create({ userId: user.id }, transaction),
                ]);

            }

            const { accessToken, refreshToken } = await this.generateTokens(user.id, transaction);





            return {
                user: await this.userService.getCombinedUser(user, patient),
                clinic: clinics[0],
                accessToken,
                refreshToken,
            };
        });
    }




    async generateTokensAndUserData( user: User)  {
        const { id } = user;
        const isTokenValid = await this.tokenService.isTokenValid(id);

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


        return {
            user,
            clinic: clinicUser.clinic,
            accessToken,
            refreshToken,
            isTokenValid,
            isRegistration: false
        };
    }


   async refresh(userId: number):Promise<AuthResponseType> {
       let user = await this.userService.findOneUserById(userId);

       const patient = await this.userApiService.getPatient(user.phone, user.tokens.cipher);
       if (user && patient?.exist) {
           if (user.misId !== patient.id) {
               await user.update({misId: patient.id});
           }
       }
       const clinicUser = await this.clinicUserService.findClinicByUserId(userId);

       const {accessToken, refreshToken } = await  this.generateTokens(userId);
        return {
            clinic: clinicUser.clinic,
            user:  await this.userService.getCombinedUser(user, patient),
            accessToken,
            refreshToken,
        };
    }

    async logout(userId: number): Promise<ResponseMessageDto> {
       await this.tokenService.removeRefreshToken(userId)
        return new ResponseMessageDto('ok', true);
    }


    private async generateTokens(userId: number, transaction?: Transaction): Promise< {accessToken: string, refreshToken: string}> {

        const accessToken = this.tokenBaseService.generateAccessToken({userId});
        const refreshToken = this.tokenBaseService.generateRefreshToken({userId});
         await this.tokenService.saveRefreshToken(userId, refreshToken, transaction);

        return {

            accessToken,
            refreshToken,
        }
    }


  }