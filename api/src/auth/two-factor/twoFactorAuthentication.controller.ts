import {
	Controller,
	Post,
	Get,
	UseGuards,
	Res,
	Body,
	UnauthorizedException,
  } from '@nestjs/common';
import { TwoFactorService } from './twoFactor.service';
import { join } from 'path';
import { of } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/login/guards/jwt.guard';
import { Iuser } from 'src/user/model/user.interface';

  @Controller('2fa')
  export class TwoFactorAuthenticationController {
	constructor(
	  private readonly twoFactorAuthenticationService: TwoFactorService,
	  private readonly usersService: UserService,
	) {}

	@Post('authenticate')
	@UseGuards(JwtAuthGuard)
	async authenticate(@Body() bod: any) {
		const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		  bod.code, await this.usersService.findOne(bod.user.id));	  
		if (!isCodeValid) {
		  throw new UnauthorizedException('Wrong authentication code');
		}
		return ;
	}

	@Post('turn-on')
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(@Body() bod: any) {
	  const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		bod.code, await this.usersService.findOne(bod.user.id));  
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }
	  await this.usersService.turnOnTwoFactorAuthentication(bod.user.id);
	}

	@Post('turn-off')
	@UseGuards(JwtAuthGuard)
	async turnOffTwoFactorAuthentication(@Body() bod: any) {
		const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		  bod.code, await this.usersService.findOne(bod.user.id));	  
		if (!isCodeValid) {
		  throw new UnauthorizedException('Wrong authentication code');
		}
		await this.usersService.turnOffTwoFactorAuthentication(bod.user.id);
	}

	@Post('generate')
	@UseGuards(JwtAuthGuard)
	async generate(@Body() user : Iuser){
		const otpauth = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
		this.twoFactorAuthenticationService.pipeQrCodeStream(otpauth.otpauthUrl);
		return (JSON.stringify(otpauth.secret));
	}
	
	@Get('qrcode')
	async findQrCode(@Res() res) {
		return of(res.sendFile(join(process.cwd(), 'src/uploads/qrcode.png')));
	}
  }