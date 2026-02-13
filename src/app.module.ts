import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import configModuleOptions from './config/options/config-module.options';
import pinoLoggerModuleOptions from './config/options/pino-logger-module.options';
import sequelizeModuleOptions from './config/options/sequelize-module.options';
import throttlerModuleOptions from './config/options/throttler-module.options';
import { ClinicModule } from '@/modules/clinic/clinic.module';
import { UserModule } from '@/modules/user/user.module';
import { TokenBaseModule } from '@/utils/modules/token/token-base.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { TrimMiddleware } from '@/middlewares/trim.middleware';
import { LogRequestBodyMiddleware } from '@/middlewares/log-request-body.middleware';
import { APP_GUARD } from '@nestjs/core';
import { MedicalNetworkModule } from '@/integrations/medicalnetwork/medical-network.module';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions()),
        ThrottlerModule.forRoot(throttlerModuleOptions()),
        LoggerModule.forRoot(pinoLoggerModuleOptions()),
        SequelizeModule.forRootAsync(sequelizeModuleOptions()),
        AuthModule,
        TokenBaseModule,
        ClinicModule,
        UserModule,
        MedicalNetworkModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },

    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TrimMiddleware, LogRequestBodyMiddleware).forRoutes('*');
    }
}
