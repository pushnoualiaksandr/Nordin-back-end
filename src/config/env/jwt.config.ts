import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('jwt', () => ({
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES),
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES),
}));
