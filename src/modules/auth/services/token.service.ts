import { ForbiddenException, Injectable } from '@nestjs/common';
import { TokenRepository } from '@/modules/auth/repository';
import { CreateTokenDto } from '@/modules/auth/data/dto/token/create-token.dto';
import { Token } from '@/core/models';
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

    async saveRefreshToken(userId: number, refreshToken: string, transaction?: Transaction): Promise<void> {
        const token = await this.findTokenByUserId(userId, transaction);
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + (this.JWT_REFRESH_EXPIRATION_TIME * 1000));

        token.refreshTokenExpiresAt = expiresAt;
        token.refreshToken = refreshToken;
        await token.save({ fields: ['refreshToken', 'refreshTokenExpiresAt'],transaction, });
    }

 async findTokenByUserId(userId: number, transaction?: Transaction): Promise<Token> {
     const token = await this.tokenRepository.findOneByOptions({ where: { userId }, transaction });
     if (!token) {
         throw new ForbiddenException();
     }
     return token;
 }


    async isTokenValid(userId: number): Promise<boolean> {
        try {
            const token = await this.findTokenByUserId(userId);

            if (token.refreshToken === null) {
                return false;
            }

            if (token.refreshTokenExpiresAt) {
                const now = new Date();
                return now.getTime() < token.refreshTokenExpiresAt.getTime()

            }

            return !!(!token.refreshTokenExpiresAt && token.refreshToken);


        } catch (error) {
            throw new ForbiddenException();
        }
    }


 async removeRefreshToken(userId: number): Promise<void> {
     const token = await this.findTokenByUserId(userId);
     token.refreshToken =null;
     token.refreshTokenExpiresAt = null;
     await token.save({fields: ['refreshToken', 'refreshTokenExpiresAt']});
 }

}