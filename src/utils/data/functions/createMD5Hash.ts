import { createHash } from 'crypto';


export function createMD5Hash(phone: string, code: string | number): string {

    const dataToHash = `${phone}${code}`;

    return createHash('md5').update(dataToHash).digest('hex').toUpperCase();


}

