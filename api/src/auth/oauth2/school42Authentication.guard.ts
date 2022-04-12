import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export class School42AuthenticationGuard extends AuthGuard('school42') {
    handleRequest(err:any, user:any, info: any) {
        if (info && info.message === "Request denied")
            return "failure";
		if (err || !user) {
		  throw err || new UnauthorizedException ();
		}
		return user;
	}

}