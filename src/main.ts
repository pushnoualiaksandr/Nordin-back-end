import { Logger as NestLogger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { Logger as PinoLogger, LoggerErrorInterceptor } from 'nestjs-pino';
import * as process from 'node:process';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { SequelizeErrorFilter } from './core/filter/sequelize-error.filter';
import { ValidationPipe } from './core/pipes/validation.pipe';
import { CORS_URLS } from '@/utils/data/const';
import { Clinic } from '@/core/models';

async function bootstrap() {

    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    const config = app.get(ConfigService);

    const port = config.getOrThrow('app.port');
      
    const nodeEnv = config.getOrThrow('app.nodeEnv');
    const debugMode = config.getOrThrow('app.debugMode');
    const dbSync = config.getOrThrow('database.sync');

    app.enableCors({
        credentials: true,
        origin: CORS_URLS,
    });

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    app.setGlobalPrefix('api');

    app.useGlobalFilters(new HttpExceptionFilter(), new SequelizeErrorFilter());
    const configSwagger = new DocumentBuilder()
        .setTitle('Documentation')
        .setDescription('Documentation Rest Api')
        .setVersion('1.0.0')
        .addBearerAuth(
            {
                description: `[just text field] Введите токен в следующем формате: Bearer <JWT>`,
                name: 'Authorization',
                bearerFormat: 'Bearer',
                scheme: 'Bearer',
                type: 'http',
                in: 'Header',
            },
            'access-token',
        )
        .build();
    const document = SwaggerModule.createDocument(app, configSwagger, { extraModels: [Clinic]});
    SwaggerModule.setup('api/docs', app, document, );

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
 
    app.useLogger(app.get(PinoLogger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    app.use(helmet());
    app.use(compression());

    await app.listen(port);

    NestLogger.log({ nodeEnv, debugMode, dbSync, port }, 'Server params');
}

process.on('uncaughtException', (exception: Error) => {
    NestLogger.error({ exception }, 'Uncaught Exception');
});

bootstrap().catch((error) => {
    NestLogger.error(error, 'Bootstrap error');
    process.exit(1);
});
