import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from '../interfaces/ITokenPayload';
import { STRATEGY_NAMES } from '../data/constants/const';
import { UserStatus } from '@/utils/data/enums/UserStatus';
import { UserService } from '@/modules/user/services';
import { User } from '@/core/models';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, STRATEGY_NAMES.REFRESH) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('jwt.refreshSecret'),
            ignoreExpiration: false,
            passReqToCallback: true,
        });

    }

    async validate(request: Request, payload: ITokenPayload): Promise<User> {

        const refreshToken = request.get('authorization').replace('Bearer', '').trim();

        const user = await this.userService.getIfRefreshMatch(refreshToken, payload.userId);

        if (!user) {
            throw new ForbiddenException();
        }

        if (user.status === UserStatus.BLOCKED) {
            throw new ForbiddenException();
        }

        return user;
    }
}
