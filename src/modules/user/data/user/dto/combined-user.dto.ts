import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/core/models';
import { UserApiResponse } from '@/integrations/medicalnetwork/services';
import { Gender } from '@/utils/data/enums/Gender';
import { UserStatus } from '@/utils/data/enums/UserStatus';
import { Role } from '@/utils/data/enums/Role';
import { isNotEmptyArray } from '@/utils/data/functions/validateArray';


export class CombinedWardDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: '12345' })
    misId: string;

    @ApiProperty({ example: 'd5dss5' })
    avatarKey?: string;

    @ApiProperty({ example: 'Иванов Иван Иванович' })
    fio: string;

    @ApiProperty({ example: '08.06.2000' })
    birthday: string;

    @ApiProperty({ example: 'male' })
    gender: Gender;

    @ApiProperty({ example: '+375291234567' })
    phone?: string;

    @ApiProperty({ example: 'test@gmail.com' })
    email?: string;

    @ApiProperty({ example: true })
    isMobConfirmed: boolean;

    @ApiProperty({ example: true })
    isMobChild: boolean;

    @ApiProperty({ example: true })
    isAdult: boolean;
}

export class CombinedUserDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'male' })
    gender: Gender;

    @ApiProperty({ example: '+375291234567' })
    phone: string;

    @ApiProperty({ example: '12345' })
    misId: number;

    @ApiProperty({ example: 'd5dss5' })
    avatarKey: string;

    @ApiProperty({ example: 'https://someserver/mobile/patient/photo/14A34497-E3B1-43EF-BE1C-1D2034461CE5_667148' })
    avatarUrl: string;

    @ApiProperty({ example: 'verified' })
    status: UserStatus;

    @ApiProperty({ example: 'patient' })
    role: Role;

    @ApiProperty({ example: true })
    isAdult: boolean;

    @ApiProperty({ example: true })
    isMobConfirmed: boolean;

    @ApiProperty({ example: 1 })
    isMobChild: number;

    @ApiProperty({ example: 'Иванов Иван Иванович' })
    fio: string;

    @ApiProperty({ example: 'test@gmail.com' })
    email: string;

    @ApiProperty({ example: '08.06.2000' })
    birthday: string;

    @ApiProperty({example: true})
    isNotificationsEnabled: boolean;

    @ApiProperty({example: true})
    isPrivacyPolicy: boolean;

    @ApiProperty({example: true})
    isProcessingPersonalData: boolean;

    @ApiProperty({example: true})
    isEmailNewsLetter: boolean;

    @ApiProperty({example: true})
    isTermsOfUse: boolean;

    @ApiProperty({ type: [CombinedWardDto] })
    wards: CombinedWardDto[];

    @ApiProperty({example: true})
    isFaceId: boolean;

    @ApiProperty({example: true})
    isCodPass: boolean;

    constructor(user: User, apiData?: UserApiResponse) {
        this.id = user.id;
        this.gender = user.gender;
        this.phone = user.phone;
        this.misId = user.misId;
        this.avatarKey = user.avatarKey;
        this.status = user.status;
        this.role = user.role;
        this.isAdult = user.isAdult;
        this.isNotificationsEnabled = user.isNotificationsEnabled;
        this.isFaceId = user.isFaceId;
        this.isCodPass = user.isCodPass;
        this.avatarUrl = user.avatarUrl;

        if (apiData) {
            this.isMobConfirmed = apiData.mob_confirmed;
            this.isMobChild = apiData.is_mob_child;
            this.email = apiData.email;
            this.fio = apiData.fio;
            this.isPrivacyPolicy = Boolean(apiData.is_privicy_policy)
            this.isProcessingPersonalData = Boolean(apiData.is_agreement)
            this.isEmailNewsLetter = Boolean(apiData.is_get_email)
            this.isTermsOfUse = Boolean(apiData.is_terms_of_use)
            this.birthday = apiData.birthday;
            this.wards = this.enrichWardsWithRelatives(user, apiData)

        } else {
            this.wards = [];
        }
    }

    private enrichWardsWithRelatives(user: User, apiData: UserApiResponse):  CombinedWardDto[] {

         const data = {};
         for (const ward of user.wards) {
             data[ward.misId] = {
                 misId : ward.misId,
                 id: ward.id,
                 avatarKey: ward.avatarKey,
                 avatarUrl: ward.avatarUrl,
                 isCodPass: user.isCodPass,
                 isFaceId: user.isFaceId,
                 role: user.role,
                 status: user.status,
                 isNotificationsEnabled: user.isNotificationsEnabled,
                 wards:[]

             }
         }

        if (!apiData?.relatives || !isNotEmptyArray(apiData.relatives)) {
            return [];
        }


         return apiData.relatives.map(relative => (
             {
                 ...data[relative.id],
                 fio: relative.fio,
                 birthday: relative.birthday,
                 phone: relative.phone,
                 gender: relative.sex === 'm' ? Gender.MALE : Gender.FEMALE,
                 email: relative.email,
                 isMobConfirmed: relative.mob_confirmed,
                 isMobChild: Boolean(relative.is_mob_child),
                 isAdult: Boolean(!relative.is_mob_child),
                 isPrivacyPolicy: Boolean(relative.is_privicy_policy) || true,
                 isEmailNewsLetter: Boolean(relative.is_get_email) || false,
                 isProcessingPersonalData: Boolean(relative.is_agreement) || true,
             }))


    }
}