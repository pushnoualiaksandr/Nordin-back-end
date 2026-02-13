import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokenBaseService } from './token-base.service';

@Module({
    imports: [JwtModule.register({})],
    providers: [TokenBaseService],
    exports: [TokenBaseService],
})
export class TokenBaseModule {}
