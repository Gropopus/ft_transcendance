import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { toFile } from 'qrcode';
import { Iuser } from 'src/user/model/user.interface';

@Injectable()
export class TwoFactorService {
  constructor (
    private readonly usersService: UserService,
	private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
 
  public async generateTwoFactorAuthenticationSecret(user: Iuser) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(otpauthUrl: string) {	  
	  toFile('src/uploads/qrcode.png',otpauthUrl);
  }

  public async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: Iuser) {
    const u1 = await this.usersService.findOne(user.id);
    authenticator.options = {
      window: 1,
    };
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: u1.twoFactorAuthenticationSecret
    })
  }

  public getCookieWithJwtToken(Iuserid: number, isSecondFactorAuthenticated = false) {
    const payload: TokenPayload = { Iuserid, isSecondFactorAuthenticated };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `10000`
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('10000')}`;
	return {
		cookie,
		token,
	  };
  }

  async validate(payload: TokenPayload) {
    const user = await this.usersService.getOne(payload.Iuserid);
    if (!user.twoFactorAuthEnabled || payload.isSecondFactorAuthenticated) {
      return user;
    }
  }
}