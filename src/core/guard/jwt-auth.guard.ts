import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { STRATEGY_NAMES } from '../../modules/auth/data/constants/const';
import { IS_PUBLIC_KEY } from '../decorator/is-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_NAMES.ACCESS) {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
     
        const cookies = context.switchToHttp().getRequest().cookies;
        const tokenExist = cookies && (cookies['access'] || cookies['refresh']);
        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

        if (!isPublic || tokenExist) {
            return super.canActivate(context);
        }

        if (isPublic) {
            if (tokenExist) {
                return super.canActivate(context);
            }

            return true;
        }
    }
}
