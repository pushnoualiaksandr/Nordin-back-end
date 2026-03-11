import { UserRepository } from '@/modules/user/repository';
import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/data/user/dto';
import { User } from '@/core/models';
import { AuthExceptions } from '@/core/exception';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { UserExceptions } from '@/exceptions/message.exception';
import { compare } from 'bcrypt';
import { Transaction } from 'sequelize';
import { UserApiResponse, UserApiService } from '@/integrations/medicalnetwork/services';
import { Sequelize } from 'sequelize-typescript';
import { getRandomUUID } from '@/utils/data/functions/getRandomUUID';
import { GetAvatarQuery } from '@/modules/user/data/user/query';
import { SignUpDto } from '@/modules/auth/data/dto/auth';
import { Gender } from '@/utils/data/enums/Gender';
import { CombinedUserDto } from '@/modules/user/data/user/dto/combined-user.dto';
import { mapToUserCreateRequest } from '@/utils/data/functions/mapToUserCreateRequest';


@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);


    constructor(
        private readonly userRepository: UserRepository,
        private readonly userApiService:UserApiService,
        @Inject(Sequelize) private readonly sequelize: Sequelize,
    ) {}

     async createUser(dto: CreateUserDto,isAdult: boolean = true, transaction?: Transaction): Promise<User> {
      const {phone } = dto
      const user = await this.findOneUserByPhone(phone, transaction);
        if (user && isAdult) {
            throw new ConflictException(AuthExceptions.ALREADY_REGISTERED)
        }

        return  await this.userRepository.create(dto, {transaction});
     }

     async changeUser(body: UpdateUserDto): Promise<ResponseMessageDto> {
       const { phone, } = body
        const user = await this.findUserByPhoneOrThrow(phone);

      const updateRequest = mapToUserCreateRequest(body);

       console.log('body',updateRequest)

      const res =  await  this.userApiService.changePatient(updateRequest, user.tokens.cipher)
      console.log('res=>',res)
         return new ResponseMessageDto('ok', true);
     }


     async updateUser(id: number, dto: UpdateUserDto): Promise<ResponseMessageDto> {
         return this.sequelize.transaction(async (transaction) => {
             const user = await this.findOneUserById(id, transaction);
             if ('isCodPass' in dto && !dto.isCodPass) {
                 await user.tokens.update(
                     { codePassHash: null },
                     { transaction }
                 );
             }

             if ('isFaceId' in dto && !dto.isFaceId) {
                 await user.tokens.update(
                     {
                         publicKey: null,
                         deviceId: null
                     },
                     { transaction }
                 );
             }


             await user.update(
                  { ...dto },
                 { transaction }
             );
             return new ResponseMessageDto('ok', true);

         })




     }


     async findOneUserByPhone(phone: string, transaction?: Transaction): Promise<User>  {
       return  await this.userRepository.findOneByOptions({ where: { phone, isAdult: true },   include: this.userRepository.buildInclude(),transaction },);

     }

     async findUserByPhoneOrThrow(phone:string): Promise<User> {
         const user = await this.userRepository.findOneByOptions({ where: { phone, isAdult: true },  include: this.userRepository.buildInclude() });

         if (!user) {
             throw new NotFoundException(AuthExceptions.USER_NOT_FOUND)
         }
         return user
     }



    async findOneUserById(id: number, transaction?: Transaction): Promise<User>  {
        const user = await this.userRepository.findById(id,{
            include: this.userRepository.buildInclude(),
            transaction
        } );
        if (!user) {
            throw new NotFoundException(AuthExceptions.USER_NOT_FOUND)
        }
        return user;
    }



    async deleteUser(id: number): Promise<ResponseMessageDto> {
        return this.sequelize.transaction(async (transaction) => {
            const user = await this.findOneUserById(id, transaction);

            const res =  await  this.userApiService.changePatient({phone:user.phone}, user.tokens.cipher);

            if (res.isok) {
                await user.destroy({transaction});

                this.logger.log({userId: id}, UserExceptions.USER_DELETED)
                return new ResponseMessageDto(UserExceptions.USER_DELETED, true);
            } else {
                new BadRequestException(UserExceptions.COULD_NOT_DELETE_USER)
            }

        })
     }

    async findOneByIdWithRefreshToken(id: number): Promise<User> {
        return await this.userRepository.findById(id, {
            include: this.userRepository.buildInclude(),
        });
    }

    async getIfRefreshMatch(refreshToken: string, userId: number): Promise<User> {
        const user = await this.findOneByIdWithRefreshToken(userId);

         if (!user?.tokens?.refreshToken) {
            throw new BadRequestException(AuthExceptions.WRONG_REFRESH_TOKEN);
        }

        const isRefreshMatch = await compare(refreshToken, user.tokens.refreshToken);

        if (!isRefreshMatch) {
            throw new BadRequestException(AuthExceptions.WRONG_REFRESH_TOKEN);
        }

        return user;
    }

   async getMe(userId: number): Promise<CombinedUserDto>  {
        const user = await  this.findOneByIdWithRefreshToken(userId);
        return await this.getCombinedUser(user);
    }

    async getCombinedUser(user: User, patient?: UserApiResponse) : Promise<CombinedUserDto> {
          if (!patient) {
            try {
                patient = await this.userApiService.getPatient(user.phone, user.tokens.cipher);
            } catch {
                throw new BadRequestException(AuthExceptions.USER_NOT_FOUND);
            }
        }

        return new CombinedUserDto(user, patient);

    }

    async uploadAvatar(userId: number, file: Express.Multer.File): Promise<ResponseMessageDto> {
        const user = await this.findOneByIdWithRefreshToken(userId);
        const key = getRandomUUID();
        console.log('fole=>',file)
        const response = await this.userApiService.uploadPatientAvatar(user.misId, key, file);

        console.log('response=>',response)

        if (!response.update) {
            throw new InternalServerErrorException('Internal server error');
        }

        const avatarUrl = await this.userApiService.getPatientAvatarUrl(user.misId, key);

        if (!avatarUrl.url) {
            throw new InternalServerErrorException('Internal server error');
        }

        user.avatarUrl = avatarUrl.url;
        user.avatarKey = key;
        await user.save({ fields: ['avatarKey', 'avatarUrl'] });

        return new ResponseMessageDto('ok', true);
    }

    async deleteAvatar(userId: number): Promise<ResponseMessageDto> {
        const user = await this.findOneByIdWithRefreshToken(userId);
        console.log('user=>',user)
        const response = await this.userApiService.deletePatientAvatar(user.misId, user.avatarKey);

        if (!response.update) {
            throw new InternalServerErrorException('Internal server error');
        }
        console.log('response=>',response)
        await user.update({ avatarKey: null, avatarUrl: null });

        return new ResponseMessageDto('ok', true);
    }


    async getAvatar(query: GetAvatarQuery): Promise<ArrayBuffer> {
      const {misId, avatarKey } = query;
      return  await  this.userApiService.getPatientAvatar(+misId, avatarKey)
     }


     async getOrCreatePatientInMis(dto: SignUpDto, cipher: string, code: string, isAdult?:boolean):Promise<UserApiResponse> {
         const {dateOfBirth,firstName, lastName, patronymic, email} = dto;

         let patient = await this.userApiService.getPatient(dto.phone,cipher);
         console.log('patient exist=>',patient)
         if (!patient.exist) {
             patient = await this.userApiService.createPatient({
                 code4: code,
                 name: `${lastName} ${firstName} ${patronymic}`,
                 phone: dto.phone,
                 sex: dto.gender === Gender.MALE ? 'm' : 'w',
                 birthDate: dateOfBirth.toString(),
                 email: !email ? '' : email,
                 is_get_email: Number(dto.isEmailNewsLetter),
                 is_agreement: Number(dto.isProcessingPersonalData),
                 is_mob_child: !isAdult ? 1 : 0 ,
                 is_get_sms: 0 ,
                 is_privicy_policy: Number(dto.isPrivacyPolicy),
                 is_term_of_use: Number(dto.isPrivacyPolicy)

             })
             console.log('patient created=>',patient)

         }

         return patient;
     }



 }