import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckResult,
    HealthCheckService,
    MemoryHealthIndicator,
    SequelizeHealthIndicator,
} from '@nestjs/terminus';

@Controller('health-check')
export class HealthCheckController {
    static readonly HEALTH_CHECK_URL = '/api/health-check/ping';

    private readonly memoryMinLimit = 300 * 1024 * 1024;

    private readonly databasePingTimeout = 5000;

    constructor(
        private readonly health: HealthCheckService,
        private readonly sequelizeHealthIndicator: SequelizeHealthIndicator,
        private readonly memoryHealthIndicator: MemoryHealthIndicator,
    ) {}

    @Get('ping')
    @HealthCheck()
    check(): Promise<HealthCheckResult> {
        return this.health.check([
            () =>
                this.sequelizeHealthIndicator.pingCheck('database', {
                    timeout: this.databasePingTimeout,
                }),
            () => this.memoryHealthIndicator.checkRSS('memory RSS', this.memoryMinLimit),
            () => this.memoryHealthIndicator.checkHeap('memory Heap', this.memoryMinLimit),
        ]);
    }
}
