import { Module } from '@nestjs/common';
import { TokenBaseModule } from '@/utils/modules/token/token-base.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthService, TokenService, VerifyService } from '@/modules/auth/services';
import { JwtAccessStrategy } from '@/modules/auth/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '@/modules/auth/strategies/jwt-refresh.strategy';
import { TokenRepository } from '@/modules/auth/repository';
import { AuthController } from '@/modules/auth/controllers/auth.controller';
import { VerifyRepository } from '@/modules/auth/repository/verify.repository';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token, Verification } from '@/core/models';
import { ClinicModule } from '@/modules/clinic/clinic.module';
import { JwtAuthGuard } from '@/core/guard/jwt-auth.guard';
import { JwtRefreshGuard } from '@/core/guard/jwt-refresh.guard';
import { PassportModule } from '@nestjs/passport';
import { STRATEGY_NAMES } from '@/modules/auth/data/constants';
import { MedicalNetworkModule } from '@/integrations/medicalnetwork/medical-network.module';


@Module({
    imports: [PassportModule.register({
        defaultStrategy: STRATEGY_NAMES.ACCESS,
    }),SequelizeModule.forFeature([Verification, Token]), TokenBaseModule, UserModule, ClinicModule, MedicalNetworkModule ],
    controllers: [AuthController],
    providers: [AuthService,TokenService,VerifyRepository, VerifyService,  TokenRepository, JwtAccessStrategy, JwtRefreshStrategy,  SchedulerRegistry, JwtAuthGuard,
        JwtRefreshGuard],
    exports: [AuthService, TokenService, VerifyService,  JwtAuthGuard,
        JwtRefreshGuard,],
})
export class AuthModule {}