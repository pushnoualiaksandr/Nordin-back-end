import { Module } from '@nestjs/common';
import { TokenBaseModule } from '@/utils/modules/token/token-base.module';
import { UserModule } from '@/modules/user/user.module';
import { AuthService, TokenService, } from '@/modules/auth/services';
import { JwtAccessStrategy } from '@/modules/auth/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '@/modules/auth/strategies/jwt-refresh.strategy';
import { TokenRepository } from '@/modules/auth/repository';
import { AuthController } from '@/modules/auth/controllers/auth.controller';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token, } from '@/core/models';
import { ClinicModule } from '@/modules/clinic/clinic.module';
import { JwtAuthGuard } from '@/core/guard/jwt-auth.guard';
import { JwtRefreshGuard } from '@/core/guard/jwt-refresh.guard';
import { PassportModule } from '@nestjs/passport';
import { STRATEGY_NAMES } from '@/modules/auth/data/constants';
import { MedicalNetworkModule } from '@/integrations/medicalnetwork/medical-network.module';
import { PasscodeController } from '@/modules/auth/controllers/pass-code.controller';
import { PasscodeService } from '@/modules/auth/services/pass-code.service';
import { VerifyService } from '@/modules/auth/services/verification.service';
import { VerifyRepository } from '@/modules/auth/repository/verify.repository';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BiometricService } from '@/modules/auth/services/biometric.service';
import { BiometricController } from '@/modules/auth/controllers/biometric.controller';
import { WardService } from '@/modules/auth/services/ward.service';


@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: STRATEGY_NAMES.ACCESS,
        }),
        SequelizeModule.forFeature([Token]),
        RedisModule.forRoot({
            type: 'single',
            options: {
                host: '127.0.0.1',
                port: 6379,
            },
        }),
        TokenBaseModule,
        UserModule,
        ClinicModule,
        MedicalNetworkModule
    ],
    controllers: [AuthController, PasscodeController, BiometricController],
    providers: [
        AuthService,
        VerifyRepository,
        BiometricService,
        TokenService,
        PasscodeService,
        VerifyService,
        TokenRepository,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        SchedulerRegistry,
        JwtAuthGuard,
        JwtRefreshGuard,
        WardService
    ],
    exports: [
        AuthService,
        TokenService,
        JwtAuthGuard,
        JwtRefreshGuard,
        PasscodeService,
        VerifyService,
        BiometricService,
        WardService
    ],
})
export class AuthModule {}