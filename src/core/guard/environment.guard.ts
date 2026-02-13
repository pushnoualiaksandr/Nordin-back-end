import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpStatusCode } from 'axios';
import * as process from 'node:process';

import { ENVIRONMENT_KEY } from '../decorator/environment.decorator';

@Injectable()
export class EnvironmentGuard implements CanActivate {
    private readonly logger = new Logger(EnvironmentGuard.name);

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const environments = this.reflector.get<string[]>(ENVIRONMENT_KEY, context.getHandler());
        if (!environments) {
            return true;
        }

        const currentEnvironment = process.env.NODE_ENV;
        const isAllowed = environments.includes(currentEnvironment);
        if (!isAllowed) {
            this.logger.warn(
                {
                    statusCode: HttpStatusCode.Locked,
                    date: new Date().toISOString(),
                },
                'The current environment is not allowed to access this route.',
            );
        }

        return isAllowed;
    }
}
