

export type UserApiResponse = {
    exist: boolean;
    id?: number;
    fio?: string;
    birthday?: string
    mob_confirmed?: boolean;
    relatives?: UserRelatives[];
};

export type UserRelatives = {
    id: number;
    fio: string;
    phone: string;
};