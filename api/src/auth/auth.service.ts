import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Iuser } from 'src/user/model/user.interface';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

  constructor(
	private readonly jwtService: JwtService,
	/*private readonly configService: ConfigService*/
	) {}

  async generateJwt(user: Iuser): Promise<string> {
    return this.jwtService.signAsync({user});
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswords(password: string, storedPasswordHash: string): Promise<any> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }

}
