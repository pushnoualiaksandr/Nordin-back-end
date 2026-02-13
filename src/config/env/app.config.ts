import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('app', () => ({
    clientUrl: process.env.CLIENT_URL,
    port: parseInt(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
    debugMode: Boolean(parseInt(process.env.DEBUG_MODE)) || false,
}));
