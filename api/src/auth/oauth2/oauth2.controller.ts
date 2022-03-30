import { Req, Controller, HttpCode, UseGuards, Res, Get, Inject, forwardRef } from '@nestjs/common';
import { TwoFactorService } from '../two-factor/twoFactor.service';
import RequestWithUser from '../requestWithUser.interface';
import { Response } from 'express';
import { School42AuthenticationGuard } from './school42Authentication.guard';
import {UserService} from 'src/user/user.service';
import { Iuser } from 'src/user/model/user.interface';


@Controller('oauth2')
export class Oauth2Controller {
  constructor(
    //private twofactorService: TwoFactorService,
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,) { }

  @Get('school42/callback')
  @UseGuards(School42AuthenticationGuard)
  @HttpCode(200)
  async school42Callback(@Req() request: any, @Res() response: Response) {
  const { user } = request;
  console.log(user);
  const userEntity: Iuser = {email: user.email, password: 'School42'};
	const login = await this.usersService.login(userEntity);
	const resp = {id : user.id42 ,two_factor: user.twoFactorAuthEnabled , token: login.jwt};
    try {
		 await response.send(user);
    } catch (error) {
      response.redirect('http://localhost:4200');
    }
    console.log("OK");
  }

  @Get('school42')
  @UseGuards(School42AuthenticationGuard)
  @HttpCode(200)
  async logSchool42() {
  }

}