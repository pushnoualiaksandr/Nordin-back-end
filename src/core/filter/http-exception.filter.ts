import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { HealthCheckController } from 'src/utils/health-check/health-check.controller';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        this.logger.error(exceptionResponse, exception.stack);

        const parsedResponse =
            (typeof exceptionResponse === 'object' && 'validationMessage' in exceptionResponse) ||
            request.url === HealthCheckController.HEALTH_CHECK_URL
                ? exceptionResponse
                : { validationMessage: [exceptionResponse] };

        response.status(status).json({
            response: parsedResponse,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
        });
    }
}
