import { Body, Controller, Param, Get, Res, Post, Request, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './model/dto/create-user.dto';
import { LoginUserDto } from './model/dto/login-user.dto';
import { LoginResponseI } from './model/login-response.interface';
import { Iuser } from './model/user.interface';
import { Observable, of } from 'rxjs';
import { UserHelperService } from './user-helper/user-helper.service';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/login/guards/jwt.guard'
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import * as fs from 'fs';

export const storage = {
  storage: diskStorage({
      destination: './src/uploads/',
      filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '');
          const extension: string = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`)
      }
  })

}

@Controller('users')
export class UserController {

  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) { }

	@Post()
	async create(@Body() createUserDto: CreateUserDto): Promise<Iuser> {
	  const userEntity: Iuser = this.userHelperService.createUserDtoToEntity(createUserDto);
	  return this.userService.create(userEntity);
	}

	@Get()
	async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Iuser>> {
	  limit = limit > 100 ? 100 : limit;
	  return this.userService.findAll({ page, limit, route: 'http://localhost:3000/api/users' });
	}

	@Put(':id/isOnline')
	async userIsOnline(@Param() params) {
		return this.userService.updateLastTaskTime(params.id);
	}

	@Get('/find-by-username/:name')
		async findAllByUsername(@Param() params): Promise<Iuser> {	  
	 	return this.userService.findAllByUsername(params.name);
	}

	@Get('/search/:key')
	async searchUser(@Param() params): Promise<Iuser[]>  {	  
		return this.userService.searchUser(params.key);
}

	@Get('/find-by-email/:email')
	async findOneByEmail(@Param() params): Promise<Iuser> {	  
	  return this.userService.findOneByEmail(params.email);
	}
  
	@Get(':id')
	async findOne(@Param() params): Promise<Iuser>{    
		  return this.userService.findOne(params.id);
	}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
    const userEntity: Iuser = this.userHelperService.loginUserDtoToEntity(loginUserDto);
    const login = await this.userService.login(userEntity);
    let expiresIn = 10000;
    if (login.payload.twoFactorAuthEnabled)
      expiresIn = 30;
	return {
      access_token: login.jwt,
      token_type: 'JWT',
      expires_in: expiresIn,
	    two_factor: login.payload.twoFactorAuthEnabled,
      id: login.payload.id,
    };
  }

  @Get('ladder-level/:id')
  async getLadderLevel(@Param() params) {
	  return this.userService.getLadderLevel(params.id);
  }
  
	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Body() user: Iuser): Promise<any> {
	  return this.userService.logout(user);
	}
	
	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async updateOne(@Param('id') id: string, @Body() user: Iuser): Promise<any> {    
	  return this.userService.updateOne(Number(id), user);
	}
  
	@Post('update/:id')
	async updateUser(@Param() params, @Body() user: Iuser) {
		return this.userService.updateUser(params.id, user);
	}

	@UseGuards(JwtAuthGuard)
	@Post('upload')
	@UseInterceptors(FileInterceptor('file', storage))
	async uploadFile(@UploadedFile() file) {

	}

	@Get('picture/:picturename')
	findProfileImage(@Param('picturename') picturename, @Res() res): Observable<Object> {
	    return of(res.sendFile(join(process.cwd(), 'src/uploads/' + picturename)));
	}

	@Get('pictureById/:id')
	async findProfileImageById(@Param('id') id, @Res() res): Promise<Object> {
	    const user = await this.userService.findOne(id);
	    return of(res.sendFile(join(process.cwd(), 'src/uploads/' + user.picture)));
	}

}
