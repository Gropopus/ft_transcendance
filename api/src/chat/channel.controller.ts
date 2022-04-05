import { Body, Controller, Param, Get, Put, Post, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/login/guards/jwt.guard'
import { RolesGuard } from 'src/auth/login/guards/roles.guards';
import { hasRoles } from 'src/auth/login/roles.decorator';
import { Ichannel, ChannelType } from 'src/chat/model/channel.interface';
import { ChannelService } from 'src/chat/channel.service';
import { Iuser, UserRole } from 'src/user/model/user.interface';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { runInNewContext } from 'vm';
import { MessageService } from './service/message.service';
import { Imessage } from './model/message.interface';


@Controller('channel')
export class ChannelController {

  constructor(
	private channelService: ChannelService,
	private userService: UserService,
	private messageService: MessageService,
  ) { }

	@Get('all')
	async getAllChannels(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Ichannel>>{
		return this.channelService.getAllChannel({ page, limit, route: 'http://localhost:3000/api/channel/all' });
	}

	@Put('new/:creatorId')
	async createChannel(@Param() params, @Body() chan: Ichannel): Promise<Ichannel> {
		const creator = await this.userService.findOne(params.creatorId);
		return this.channelService.createChannel(chan, creator);
	}

	@Put('direct-message/new/:user1/:user2')
	async newDirectMessage(@Param() params): Promise<Ichannel> {
		const u1 = await this.userService.findOne(params.user1);
		const u2 = await this.userService.findOne(params.user2);
		return this.channelService.newDirectMessage(u1, u2);
	}

	@Get('direct-message/:userId')
	async getDirectMessage(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Ichannel>> {
		return this.channelService.getDirectMessage(params.userId, { page, limit, route: 'http://localhost:3000/api/channel/direct-message/:userId' });
	}

	@Get('direct-message/:user1/:user2')
	async getOneDirectMessage(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Ichannel>> {
		return this.channelService.getOneDirectMessage(params.user1, params.user2, { page, limit, route: 'http://localhost:3000/api/channel/direct-message/:user1/:user2' });
	}

	@Put('delete/:id')
	async deleteChannel(@Param() params): Promise<any> {
		return this.channelService.deleteChannel(params.id);
	}

	//@hasRoles(UserRole.ADMIN, UserRole.OWNER)
	//@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('')
	async getAllChannelAdmin(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Ichannel>> {
	  limit = limit > 100 ? 100 : limit;
	  return this.channelService.getAllChannelAdmin({ page, limit, route: 'http://localhost:3000/api/channel' });
	}

	@Get('/all/:user')
	async getChannelsForUser(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 100): Promise<Pagination<Ichannel>> {
	  return this.channelService.getChannelsForUser(params.user, { page, limit, route: 'http://localhost:3000/api/channel/all/:user' });
	}

	@Get('/:id/info')
	async getChannelData(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Ichannel>> {
		limit = limit > 100 ? 100 : limit;
		return this.channelService.getChannelInfo(params.id, { page, limit, route: 'http://localhost:3000/api/channel/:id/users'});
	}

	@Put(':id/mute/:userId')
	async muteUser(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
		const channel = await this.channelService.getChannelInfo(params.id, { page, limit, route: 'http://localhost:3000/api/channel/:id/users'});
		return this.channelService.muteUser(
			channel.items[0],
			await this.userService.findOne(params.userId));
	}

	@Put(':id/unmute/:userId')
	async unmuteUser(@Param() params) {
		return this.channelService.deleteAUserMutedFromChannel(params.id, params.userId);
	}

	@Put(':id/ban/:userId')
	async banUser(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
		const channel = await this.channelService.getChannelInfo(params.id, { page, limit, route: 'http://localhost:3000/api/channel/:id/ban/:userId'});
		const user = await this.userService.findOne(params.userId);
		console.log(user);
		this.channelService.banUser(channel.items[0], user);
		this.channelService.deleteAUserFromChannel(Number(params.id), params.userId);
	}

	@Put(':id/unban/:userId')
	async unbanUser(@Param() params) {
		return this.channelService.unbanUser(params.id, params.userId);
	}

	//@hasRoles(UserRole.ADMIN, UserRole.OWNER)
	//@UseGuards(JwtAuthGuard, RolesGuard)
	@Put(':id/admin/destroy')
	async closeChannelAdmin(@Param('id') id: string): Promise<Ichannel> {
	  var channel: Ichannel = await this.channelService.getChannel(Number(id));
	  return this.channelService.changeTypeChannel(channel, ChannelType.CLOSE);
	}

	// @hasRoles(UserRole.ADMIN, UserRole.OWNER)
	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Put(':id/admin/give/:userId')
	async updateChannelUserForAdmin(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Ichannel> {  
	const channel = await this.channelService.getChannelInfo(params.id, { page, limit, route: 'http://localhost:3000/api/:id/users'});
	  return this.channelService.addAdminToChannel(channel.items[0],
		await this.userService.findOne(params.userId));
	}

	// @hasRoles(UserRole.ADMIN, UserRole.OWNER)
	// @UseGuards(JwtAuthGuard, RolesGuard)
	@Put(':id/admin/remove/:userId')
	async updateChannelAdminForAdmin(@Param() params): Promise<Ichannel> {
	  return this.channelService.deleteAUserAdminFromChannel(Number(params.id), params.userId);
	}

	@Put(':id/remove/:userId')
	async removeUserFromChannel(@Param() params): Promise<Ichannel> {
	  return this.channelService.deleteAUserFromChannel(Number(params.id), params.userId);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':idChannel/:idUser')
	async IusersChannel(@Param('idChannel') idChannel: number, @Param('idUser') idUser: number): Promise<Number> {
		var channel: Ichannel = await this.channelService.getChannel(idChannel);
		return this.channelService.boolIusersOnChannel(idUser, channel);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':idChannel')
	async getChannel(@Param('idChannel') idChannel: number): Promise<Ichannel> {
		return this.channelService.getChannel(idChannel);
	}

	@Put(':channelId/adduser/:username')
	async addUserToChannel(@Param() params, @Body() bod) {
		const users = await this.userService.findAllByUsername(params.username);
		let userToAdd = {};
		for (let user of users)
			if (user.username == params.username)
				userToAdd = user;
		return this.channelService.addUserToChannel(params.channelId, userToAdd, bod.password);
	}

	@Put(':userId/join/:channelId')
	async joinChannel(@Param() params, @Body() bod) {
		const userToAdd = await this.userService.findOne(params.userId);
		const channel = await this.channelService.findOne(params.channelId);
		const blacklist = channel.ban;
		const res = await this.channelService.boolUserBanedOnChannel(params.userId, params.channelId);
		if (!res)
			return this.channelService.addUserToChannel(params.channelId, userToAdd, bod.password);
	}

	@Get(':channelId/messages/:userId')
	async getMessages(@Param() params, @Query('page') page: number = 1, @Query('limit') limit: number = 1000): Promise<Pagination<Imessage>> {
		const user = await this.userService.findOne(params.userId);
		const channel = await this.channelService.findOne(params.channelId);
		const mess = await this.messageService.findMessagesForChannel(
			channel,
			user,
			{
				page,
				limit,
				route: 'http://localhost:3000/api/channel/:channelId/messages/:userId'
			}
		);
		return mess;
	}
}
