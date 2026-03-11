import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TokenService } from '@/modules/auth/services/token.service';
import { ResponseMessageDto } from '@/utils/data/dto/response-message.dto';
import { BiometricRegisterDto, BiometricVerifyDto } from '@/modules/auth/data/dto/biometric';
import Redis from 'ioredis';
import * as crypto from 'crypto';
import { AuthExceptions } from '@/core/exception';
import { AuthService } from '@/modules/auth/services/auth.service';
import { User } from '@/core/models';
import { AuthResponseType } from '@/utils/data/types/auth-response.type';
import { InjectRedis } from '@nestjs-modules/ioredis';


@Injectable()
export class BiometricService {

    constructor(
        @InjectRedis()
        private redisClient: Redis,
        private authService: AuthService,
        private tokenService: TokenService,

    ) {}

    async registerBiometric(user: User, {publicKey, deviceId}: BiometricRegisterDto ): Promise<ResponseMessageDto> {

        const token = await this.tokenService.findTokenByUserId(user.id);
         token.deviceId = deviceId;
         token.publicKey = publicKey;
         await token.save({fields: ['deviceId', 'publicKey']});

        await user.update({isFaceId: true});

         return  new ResponseMessageDto('ok', true)
    }
    async generateChallenge(userId: number): Promise<{ challenge: string }> {

        const challenge = crypto.randomBytes(32).toString('base64');

        await this.redisClient.setex(
            `biometric_challenge:${userId}`,
            120,
            challenge
        );

        return { challenge };
    }

    async verifyBiometric(userId: number, { challenge, signature}: BiometricVerifyDto): Promise<AuthResponseType> {

         const storedChallenge = await this.redisClient.get(`biometric_challenge:${userId}`);

        if (!storedChallenge || storedChallenge !== challenge) {
            throw new ForbiddenException(AuthExceptions.CHALLENGE_INVALID);

        }
        const token = await this.tokenService.findTokenByUserId(userId);

        if (!token?.publicKey) {
            throw new NotFoundException(AuthExceptions.BIOMETRIC_NOT_FOUND);
        }
        const isValid = this.verifySignature(
            challenge,
            signature,
            token.publicKey
        );

        if (!isValid) {
            throw new ForbiddenException(AuthExceptions.SIGNATURE_INVALID);
        }
        await this.redisClient.del(`biometric_challenge:${userId}`);
        return await this.authService.refresh(userId);

    }

    async disableBiometric(user: User): Promise<ResponseMessageDto> {
        const {id} = user;
        const token = await this.tokenService.findTokenByUserId(id);

        if (token) {
            await token.update({
                publicKey: null,
                deviceId: null,
            });
        }


         await user.update({isFaceId: false});

        await this.redisClient.del(`biometric_challenge:${id}`);

        return  new ResponseMessageDto('ok', true)
    }

    private verifySignature(challenge: string, signature: string, publicKey: string): boolean {
        try {
            const verifier = crypto.createVerify('RSA-SHA256');
            verifier.update(challenge);

            return verifier.verify(
                {
                    key: publicKey,
                    format: 'pem',
                },
                signature,
                'base64'
            );
        } catch (error) {
            console.error('Signature verification error:', error);
            return false;
        }
    }


}