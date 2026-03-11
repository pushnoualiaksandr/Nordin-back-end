import { Clinic, } from '@/core/models';

import { CombinedUserDto } from '@/modules/user/data/user/dto/combined-user.dto';

export type AuthResponseType = {
    clinic: Clinic,
    user: CombinedUserDto,
    refreshToken: string,
    accessToken: string
    isTokenValid?: boolean,
    isRegistration?: boolean,
}