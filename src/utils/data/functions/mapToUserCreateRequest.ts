import { UserCreateRequest } from '@/integrations/medicalnetwork/services';
import { UpdateUserDto } from '@/modules/user/data/user/dto';

export function mapToUserCreateRequest(userData: Partial<UpdateUserDto>): UserCreateRequest {

    const data : UserCreateRequest= {}

    if (userData?.email) {
        data.email = userData.email;
    }
    if (userData?.isEmailNewsLetter) {
      data.is_get_email = +userData.isEmailNewsLetter
    }
    if (userData?.isPrivacyPolicy) {
        data.is_privicy_policy = +userData.isPrivacyPolicy
    }
    if ( userData.isProcessingPersonalData) {
       data.is_agreement =  +userData.isProcessingPersonalData
    }

    if (userData?.phone) {
        data.phone = userData.phone;
    }

    return data;

}