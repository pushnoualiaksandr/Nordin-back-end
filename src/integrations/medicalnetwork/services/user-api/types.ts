

export type UserApiResponse = {
    exist?: boolean;
    id?: number;
    fio?: string;
    sex: 'm' | 'w',
    email?: string,
    birthday?: string,
    mob_confirmed?: boolean;
    is_get_email?:number,
    is_get_sms?: number
    is_agreement?: number,
    is_privicy_policy?: number,
    is_terms_of_use?: number,
    insert_or_update:number
    is_mob_child: number,
    relatives?: UserRelatives[];
};

export type UserCreateRequest= {
    code4?:string
    name?: string;
    phone?: string;
    email?: string,
    sex?: 'm' | 'w',
    birthDate?: string,
    mob_confirmed?: boolean;
    is_get_email?:number,
    is_get_sms?: number
    is_agreement?: number,
    is_privicy_policy?: number,
    is_term_of_use?: number,
    is_mob_child?: number,

};

export type UserRelatives = {
    id: number;
    fio: string;
    phone: string;
    birthday:string,
    sex?: 'm' | 'w',
    email?: string,
    is_mob_child: number,
    mob_confirmed: boolean;
    is_get_email?:number,
    is_get_sms?: number
    is_agreement?: number,
    is_privicy_policy?: number,
    }

export type IOkResponse = {
    isok: boolean;
}

export type CreateWardType = {
    parentId: number;
    id: number;
    parentcipher: string;
    cipher: string
    is_mob_child: number;
}
export type DeleteWardType = {id: number,parentId: number}