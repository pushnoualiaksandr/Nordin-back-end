import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from '@/modules/user/services';
import { TokenService } from '@/modules/auth/services/token.service';
import { ClinicService, ClinicUserService } from '@/modules/clinic/services';
import { GuardianWardsService } from '@/modules/user/services/guardian-wards.service';
import { Sequelize } from 'sequelize-typescript';
import { CreateWardDto } from '@/modules/user/data/user/dto';
import { UserStatus } from '@/utils/data/enums/UserStatus';
import { Transaction } from 'sequelize';
import { User } from '@/core/models';
import { Role } from '@/utils/data/enums/Role';
import { createMD5Hash } from '@/utils/data/functions/createMD5Hash';
import { AuthExceptions } from '@/core/exception';
import { UserApiService } from '@/integrations/medicalnetwork/services';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { SmsApiService } from '@/integrations/medicalnetwork/services/sms-api/sms-api.service';


@Injectable()
export class WardService {
    private readonly logger = new Logger(WardService.name);
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly userApiService: UserApiService,
        private readonly clinicService: ClinicService,
        private readonly clinicUserService: ClinicUserService,
        private readonly guardianWardsService:GuardianWardsService,
        private readonly smsApiService:SmsApiService,
        @Inject(Sequelize) private readonly sequelize: Sequelize,
    ) {}

    async createWard(guardianId: number, dto: CreateWardDto): Promise<User> {
        return this.sequelize.transaction(async (transaction) => {
            const {code,phone, isAdult} = dto;

            const res = await this.smsApiService.checkSmsCode(phone,code)

            if (!res.validate) {
                throw new BadRequestException(AuthExceptions.CODE_NOT_CORRECT);
            }

            if (isAdult) {
                const userFromDb = await this.userService.findOneUserByPhone(phone, transaction);
                if (userFromDb) {
                    throw new BadRequestException(AuthExceptions.ALREADY_REGISTERED)
                }
            }

            const cipher = createMD5Hash(phone, code);

            const patient = await this.userService.getOrCreatePatientInMis(dto, cipher, code, isAdult)

            if (!patient?.id)  {
                new BadRequestException(AuthExceptions.USER_CAN_NOT_CREATED);
            }

            const guardian=  await this.userService.findOneUserById(guardianId, transaction);

            const result = await this.userApiService.createWard({
                parentId: +guardian.misId,
                parentcipher: guardian.tokens.cipher,
                id: patient.id,
                cipher,
                is_mob_child: Number(!isAdult)

            })


            if (!result.isok) {
                throw new BadRequestException(AuthExceptions.WARD_CAN_NOT_BE_ADDED);
            }
           return   await this.createOtherWardEntities(dto, cipher, guardianId, patient.id, transaction)

        })
    }

    async createOtherWardEntities(dto: CreateWardDto, cipher: string, guardianId: number, misId: number, transaction?: Transaction): Promise<User> {
        const {dateOfBirth, isEmailNewsLetter, firstName, lastName, patronymic, isAdult,  ...rest } = dto;

        const [newPatient, clinics] = await Promise.all([
            this.userService.createUser({
                ...rest,
                status: UserStatus.VERIFIED,
                isNotificationsEnabled: true,
                isAdult,
                misId,
                role: Role.PATIENT,
            },isAdult, transaction),
            this.clinicService.findAllClinic(transaction),


        ]);
        await Promise.all([
            this.clinicUserService.createClinicUser(clinics[0].id, newPatient.id, transaction),
            this.tokenService.create({ userId: newPatient.id , cipher }, transaction),
            this.guardianWardsService.create(guardianId, newPatient.id, transaction)
        ])

        const guardian=  await this.userService.findOneUserById(guardianId, transaction);
        this.logger.log(`Ward created: Guardian ${guardianId} -> Ward ${newPatient.id} (${dto.phone})`);
        return guardian
    }

    async deleteWard(wardId: number, guardianId: number): Promise<ResponseMessageDto> {

        return this.sequelize.transaction(async (transaction) => {

          const ward = await this.userService.findOneUserById(wardId, transaction);

          const relations =  await  this.guardianWardsService.findWardRelations(wardId, transaction);
          const currentRelation = relations.find( (relation) => relation.guardianId === guardianId);

          if (ward.isAdult) {
              const result =  await   this.userApiService.deleteWard({id: ward.misId, parentId: currentRelation.guardian.id});

              if (!result.isok) {
                  throw new BadRequestException(AuthExceptions.WARD_CAN_NOT_BE_DELETED);
              }

          } else {
              const res =  await  this.userApiService.changePatient({phone:ward.phone}, ward.tokens.cipher);

              if (!res.isok) {
                  throw new BadRequestException(AuthExceptions.WARD_CAN_NOT_BE_DELETED);
              }
              await Promise.all(relations.map( (relation) =>  this.guardianWardsService.delete(relation.guardianId, relation.wardId, transaction)))
              await ward.destroy({transaction})
          }

            return new ResponseMessageDto('ok', true);

        })

    }

}