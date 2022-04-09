import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TasksService {
    constructor(
        private userService: UserService) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        await this.userService.handleUserConnection();
    }
}
