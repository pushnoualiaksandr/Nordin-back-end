import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY_NAMES } from '@/modules/auth/data/constants';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(STRATEGY_NAMES.REFRESH) {}
