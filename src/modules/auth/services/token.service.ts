import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { TokenRepository } from '@/modules/auth/repository';
import { CreateTokenDto } from '@/modules/auth/data/dto/token/create-token.dto';
import { Token } from '@/core/models';
import { AuthExceptions } from '@/core/exception';
import { ConfigService } from '@nestjs/config';
import { Transaction } from 'sequelize';


@Injectable()
export class TokenService {
    private readonly JWT_REFRESH_EXPIRATION_TIME: number;

 constructor(
     private readonly tokenRepository: TokenRepository,
     private readonly configService: ConfigService,) {
     this.JWT_REFRESH_EXPIRATION_TIME = this.configService.getOrThrow('jwt.refreshExpiresIn');
 }

    async create(dto: CreateTokenDto, transaction?: Transaction): Promise<Token> {
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + (this.JWT_REFRESH_EXPIRATION_TIME * 1000));

        return await this.tokenRepository.create({ ...dto, refreshTokenExpiresAt: expiresAt },{transaction});
    }

    async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
        const token = await this.findTokenByUserId(userId);
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + (this.JWT_REFRESH_EXPIRATION_TIME * 1000));

        token.refreshTokenExpiresAt = expiresAt;
        token.refreshToken = refreshToken;
        await token.save({ fields: ['refreshToken', 'refreshTokenExpiresAt'] });
    }

 async findTokenByUserId(userId: number): Promise<Token> {
     const token = await this.tokenRepository.findOneByOptions({ where: { userId } });
     if (!token) {
         throw new ForbiddenException();
     }
     return token;
 }


    async isTokenInvalid(userId: number): Promise<boolean> {
        try {
            const token = await this.findTokenByUserId(userId);

            if (token.refreshToken === null) {
                return false;
            }

            if (token.refreshTokenExpiresAt) {
                const now = new Date();
                return now.getTime() < token.refreshTokenExpiresAt.getTime()

            }

            if (!token.refreshTokenExpiresAt && token.refreshToken) {
                await this.saveRefreshToken(userId, token.refreshToken)
                return true;
            }

            return false;
        } catch (error) {
            throw new ForbiddenException();
        }
    }


 async verifyCode( code: string, userId: number): Promise<void> {
     const token = await this.findTokenByUserId(userId);
     if (token.code !== code) {
         throw new BadRequestException(AuthExceptions.CODE_NOT_CORRECT);
     }
 }
 async removeRefreshToken(userId: number): Promise<void> {
     const token = await this.findTokenByUserId(userId);
     token.refreshToken =null;
     token.refreshTokenExpiresAt = null;
     await token.save({fields: ['refreshToken', 'refreshTokenExpiresAt']});
 }

}