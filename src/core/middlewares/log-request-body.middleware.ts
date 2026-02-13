import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class LogRequestBodyMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LogRequestBodyMiddleware.name);

    use(req: Request, res: Response, next: NextFunction): void {
        const _id = randomUUID();

        res.setHeader('X-Request-Id', _id);
        this.logger.log({ [_id]: req.body }, 'request body');

        next();
    }
}
