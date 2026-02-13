import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('database', () => ({
    host: process.env.SEQUELIZE_HOST,
    port: parseInt(process.env.SEQUELIZE_PORT),
    username: process.env.SEQUELIZE_USERNAME,
    password: process.env.SEQUELIZE_PASSWORD,
    database: process.env.SEQUELIZE_DB,
    sync: Boolean(parseInt(process.env.SEQUELIZE_SYNC)) || false,
}));
