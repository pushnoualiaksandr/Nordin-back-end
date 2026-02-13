import { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';

export default (): ThrottlerModuleOptions => [
    {
        name: 'short',
        ttl: 1000,
        limit: 5,
    },
    {
        name: 'medium',
        ttl: 10000,
        limit: 15,
    },
    {
        name: 'long',
        ttl: 60000,
        limit: 100,
    },
];
