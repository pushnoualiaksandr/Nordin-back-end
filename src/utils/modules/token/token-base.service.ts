import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ITokenPayload } from '@/modules/auth/interfaces/ITokenPayload';

@Injectable()
export class TokenBaseService {
    private readonly JWT_ACCESS_EXPIRATION_TIME: number;
    private readonly JWT_REFRESH_EXPIRATION_TIME: number;

    private readonly JWT_ACCESS_SECRET: string;
    private readonly JWT_REFRESH_SECRET: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.JWT_ACCESS_SECRET = this.configService.getOrThrow('jwt.accessSecret');
        this.JWT_REFRESH_SECRET = this.configService.getOrThrow('jwt.refreshSecret');
        this.JWT_ACCESS_EXPIRATION_TIME = this.configService.getOrThrow('jwt.accessExpiresIn');
        this.JWT_REFRESH_EXPIRATION_TIME = this.configService.getOrThrow('jwt.refreshExpiresIn');
    }

    generateAccessToken(payload: ITokenPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.JWT_ACCESS_SECRET,
            expiresIn: this.JWT_ACCESS_EXPIRATION_TIME,
        });
    }

    generateRefreshToken(payload: ITokenPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.JWT_REFRESH_SECRET,
            expiresIn: this.JWT_REFRESH_EXPIRATION_TIME,
        });
    }

    verify(token: string): ITokenPayload {
        return this.jwtService.verify(token, {
            secret: this.JWT_ACCESS_SECRET,
        });
    }
}
