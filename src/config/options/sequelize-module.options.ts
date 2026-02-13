import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import * as Models from 'src/core/models';

export default (): SequelizeModuleAsyncOptions => ({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.getOrThrow('database.host'),
        port: configService.getOrThrow('database.port'),
        username: configService.getOrThrow('database.username'),
        password: configService.getOrThrow('database.password'),
        database: configService.getOrThrow('database.database'),
        models: [...Object.values(Models)],
        sync: {
            alter: configService.getOrThrow('database.sync'),
        },
        autoLoadModels: configService.getOrThrow('database.sync'),
        logging: configService.getOrThrow('app.debugMode'),
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
            acquire: 10000,
        },
        // dialectOptions: {
        //   ssl: {
        //     require: true,
        //     rejectUnauthorized: false,
        //   },
        // },
    }),
});
