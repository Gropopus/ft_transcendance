import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
	getHello(): Object {
	  return {title: 'Hello Youtube!'};
	}
}
