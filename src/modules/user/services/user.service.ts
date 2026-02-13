import { UserRepository } from '@/modules/user/repository';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@/modules/user/data/user/dto';
import { User } from '@/core/models';
import { AuthExceptions } from '@/core/exception';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { UserExceptions } from '@/exceptions/message.exception';
import { ClinicUserService } from '@/modules/clinic/services';
import { compare } from 'bcrypt';
import { Transaction } from 'sequelize';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);


    constructor(
        private readonly userRepository: UserRepository,
        private readonly clinicUserService: ClinicUserService,
    ) {}

     async createUser(dto: CreateUserDto, transaction?: Transaction): Promise<User> {
      const {phone } = dto
      const user = await this.findOneUserByPhone(phone, transaction);
        if (user) {
            throw new ConflictException(AuthExceptions.ALREADY_REGISTERED)
        }

        return  await this.userRepository.create(dto, {transaction});
     }

     async updateUser(id: number, dto: UpdateUserDto): Promise<User>  {
         await this.userRepository.update({
             where: {id}
         },
             {
                 ...dto
             }
         )

         return await this.findOneUserById(id)
     }


     async findOneUserByPhone(phone: string, transaction?: Transaction): Promise<User>  {
       return  await this.userRepository.findOneByOptions({ where: { phone },transaction },);

     }

     async findUserByPhoneOrThrow(phone:string): Promise<User> {
         const user = await this.userRepository.findOneByOptions({ where: { phone } });;

         if (!user) {
             throw new NotFoundException(AuthExceptions.USER_NOT_FOUND)
         }
         return user
     }



    async findOneUserById(id: number): Promise<User>  {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(AuthExceptions.USER_NOT_FOUND)
        }
        return user;
    }

    async deleteUser(id: number): Promise<ResponseMessageDto> {
       const user = await this.findOneUserById(id)
        await user.destroy();
        this.logger.log({userId: id}, UserExceptions.USER_DELETED)
        return new ResponseMessageDto(UserExceptions.USER_DELETED, true);
    }

    async findOneByIdWithRefreshToken(id: number): Promise<User> {
        return await this.userRepository.findById(id, {
            include: this.userRepository.buildInclude(),
        });
    }

    async getIfRefreshMatch(refreshToken: string, userId: number): Promise<User> {
        const user = await this.findOneByIdWithRefreshToken(userId);
         if (!user.tokens.refreshToken) {
            throw new BadRequestException(AuthExceptions.WRONG_REFRESH_TOKEN);
        }

        const isRefreshMatch = await compare(refreshToken, user.tokens.refreshToken);

        if (!isRefreshMatch) {
            throw new BadRequestException(AuthExceptions.WRONG_REFRESH_TOKEN);
        }

        return user;
    }


 }