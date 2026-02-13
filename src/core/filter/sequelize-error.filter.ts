import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { BaseError, ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';

@Catch(BaseError)
export class SequelizeErrorFilter implements ExceptionFilter {
    private readonly logger = new Logger(SequelizeErrorFilter.name);

    catch(error: BaseError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (error instanceof ForeignKeyConstraintError) {
            status = HttpStatus.BAD_REQUEST;
        }

        if (error instanceof UniqueConstraintError) {
            status = HttpStatus.CONFLICT;
        }

        this.logger.error(error, 'Sequelize error');

        response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            message: error.message,
        });
    }
}
