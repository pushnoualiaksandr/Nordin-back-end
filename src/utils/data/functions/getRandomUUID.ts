import * as crypto from 'crypto';

export const getRandomUUID = (options?: crypto.RandomUUIDOptions): string => crypto.randomUUID(options);
