import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

import appConfig from '@/config/env/app.config';
import databaseConfig from '@/config/env/database.config';
import jwtConfig from '@/config/env/jwt.config';
import medicalNetworkConfig from '@/config/env/medicalNetwork.config';

export default (): ConfigModuleOptions => ({
    load: [appConfig, databaseConfig, jwtConfig, medicalNetworkConfig],
    isGlobal: true,
    cache: true,
    expandVariables: true,
    validationSchema: Joi.object({
        // app
        PORT: Joi.number().required(),
        SECONDARY_PORT: Joi.number().required(),
        NODE_ENV: Joi.string().required(),
        DEBUG_MODE: Joi.number().optional(),
        CLIENT_URL: Joi.string().required(),
        // docker
        DOCKER_START_COMMAND: Joi.string().required(),

        // sequelize
        SEQUELIZE_HOST: Joi.string().required(),
        SEQUELIZE_USERNAME: Joi.string().required(),
        SEQUELIZE_DB: Joi.string().required(),
        SEQUELIZE_PASSWORD: Joi.string().required(),
        SEQUELIZE_PORT: Joi.number().required(),
        SEQUELIZE_SYNC: Joi.number().optional(),

        // jwt
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES: Joi.number().required(),
        JWT_REFRESH_EXPIRES: Joi.number().required(),

        // medical network
        MEDICAL_NETWORK_USERNAME: Joi.string().required(),
        MEDICAL_NETWORK_API_URL: Joi.string().required(),
        MEDICAL_NETWORK_PASSWORD: Joi.string().required()
    }),
});
