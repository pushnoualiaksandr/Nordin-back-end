import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('medical_network', () => ({
    url: process.env.MEDICAL_NETWORK_API_URL,
    userName: process.env.MEDICAL_NETWORK_USERNAME,
    password: process.env.MEDICAL_NETWORK_PASSWORD
}));