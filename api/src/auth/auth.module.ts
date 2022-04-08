import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './login/guards/jwt.guard';
import { AuthService } from './auth.service';
import { JwtStrategy } from './login/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { TwoFactorAuthenticationController } from './two-factor/twoFactorAuthentication.controller';
import { TwoFactorService } from './two-factor/twoFactor.service';
import { JwtTwoFactorGuard } from './two-factor/jwtTwoFactor.guard';
import { JwtStrategyTwoFactor } from './two-factor/jwt-two-factor.strategy';
import { Oauth2Controller } from './oauth2/oauth2.controller';
import { School42Strategy } from './oauth2/school42.strategy';
import { School42AuthenticationGuard } from './oauth2/school42Authentication.guard';

@Module({
  imports: [
	forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10000s'}
      })
    })
  ],
  controllers: [TwoFactorAuthenticationController, Oauth2Controller],
  providers: [AuthService, JwtStrategy, JwtAuthGuard,
			JwtStrategyTwoFactor, TwoFactorService, JwtTwoFactorGuard, School42Strategy, School42AuthenticationGuard],
  exports: [AuthService]
})
export class AuthModule {}
