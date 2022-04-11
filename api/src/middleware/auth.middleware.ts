import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Iuser } from 'src/user/model/user.interface';
import { UserService } from 'src/user/user.service';

export interface RequestModel extends Request {
  user: Iuser
}


@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private authService: AuthService, private userService: UserService) { }

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
		const tokenArray: string[] = req.headers['authorization'].split(' ');
		const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      const user: Iuser = await this.userService.getOne(decodedToken.user.id);
      if (user) {
        req.user = user;
        next();
      } else {
		  throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
		}
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

}