import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@/core/models';
import { UserStatus } from '@/utils/data/enums/UserStatus';
import { UserService } from '@/modules/user/services';
import { STRATEGY_NAMES } from '@/modules/auth/data/constants/const';
import { ITokenPayload } from '@/modules/auth/interfaces/ITokenPayload';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, STRATEGY_NAMES.ACCESS) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('jwt.accessSecret'),
            ignoreExpiration: false,
        });
       
    }

    async validate(payload: ITokenPayload): Promise<User> {
        const user = await this.userService.findOneUserById(payload.userId);

        if (!user) {
            throw new ForbiddenException();
        }

        if (user.status === UserStatus.BLOCKED) {
            throw new ForbiddenException();
        }

        return user;
    }
}
