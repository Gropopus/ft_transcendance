import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import axios from 'axios';
import {UserService} from 'src/user/user.service';
import UserOauthIdNotFoundException from '../exception/UserOauthIdNotFound.exception';
import UserNameAlreadyExistsException from '../exception/UserNameAlreadyExists.exception';

@Injectable()
export class School42Strategy extends PassportStrategy(Strategy, 'school42') {
	constructor(private usersService: UserService) {
		super({
			authorizationURL: "https://api.intra.42.fr/oauth/authorize?client_id=90727c13a881b305781354461f119b6772fdd365a2557c93b61b6d1d9015a3c4&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fcallback&response_type=code",
			tokenURL: "https://api.intra.42.fr/oauth/token",
			clientID: process.env.OAUTH_42_UID,
			clientSecret: process.env.OAUTH_42_SECRET,
			callbackURL: "http://localhost:4200/callback",
			scope: 'public',
			proxy: true,
		});
	}

	async validate (accessToken: string,
		refreshToken: string,
		profile: any,
		done: Function,
	  ): Promise<any> {
		const { data } = await axios.get('https://api.intra.42.fr/v2/me', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		try {
			let user = await this.usersService.getUserByid42(data.id);
			done(null, user);
		}
		catch (error) {
			if (error instanceof UserOauthIdNotFoundException) {
				let nbTry = 0;
				while (nbTry < 20 && nbTry >= 0) {
					try {
						if (data.login == undefined) {
							throw new UserNameAlreadyExistsException(undefined);
						}
						let username = data.login.substring(0, 13);
						if (nbTry) {
							username = username + nbTry;
						}
						let user = await this.usersService.create({
							username: username,
							password: "School42",
							id42: data.id,
							email: data.email,
						});
						user.password = undefined;
						done(null, user);
						nbTry = -1;
					} catch (e) {
						nbTry++;
					}
				}
			}

		}
	}
}