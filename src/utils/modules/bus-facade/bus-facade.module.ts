import { Module } from '@nestjs/common';

import { BusFacadeService } from './bus-facade.service';

@Module({
    providers: [BusFacadeService],
    exports: [BusFacadeService],
})
export class BusFacadeModule {}
