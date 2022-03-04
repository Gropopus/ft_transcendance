import { Body, Controller, Param, Get, Put, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/login/guards/jwt.guard'
import { RolesGuard } from 'src/auth/login/guards/roles.guards';
import { hasRoles } from 'src/auth/login/roles.decorator';
import { Ichannel, ChannelType } from 'src/chat/model/channel.interface';
import { ChannelService } from 'src/chat/channel.service';
import { Iuser, UserRole } from 'src/user/model/user.interface';
import { Observable } from 'rxjs';


@Controller('channel')
export class ChannelController {

  constructor(
	private channelService: ChannelService,
  ) { }

	@hasRoles(UserRole.ADMIN, UserRole.OWNER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get()
	async getAllChannelAdmin(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<Ichannel>> {
	  limit = limit > 100 ? 100 : limit;
	  return this.channelService.getAllChannelAdmin({ page, limit, route: 'http://localhost:3000/api/channel' });
	}

	@hasRoles(UserRole.ADMIN, UserRole.OWNER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put(':id/admin/destroy')
	async closeChannelAdmin(@Param('id') id: string): Promise<Ichannel> {
	  var channel: Ichannel = await this.channelService.getChannel(Number(id));
	  return this.channelService.changeTypeChannel(channel, ChannelType.CLOSE);
	}

	@hasRoles(UserRole.ADMIN, UserRole.OWNER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put(':id/admin/give')
	async updateChannelUserForAdmin(@Param('id') id: string, @Body() user: Iuser): Promise<Ichannel> {  
	  var channel: Ichannel = await this.channelService.getChannel(Number(id));
	  return this.channelService.addAdminToChannel(channel, user);
	}

	@hasRoles(UserRole.ADMIN, UserRole.OWNER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put(':id/admin/remove')
	async updateChannelAdminForAdmin(@Param('id') id: string, @Body() user: Iuser): Promise<Ichannel> {
	  return this.channelService.deleteAUserAdminFromChannel(Number(id), user.id);
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

}
