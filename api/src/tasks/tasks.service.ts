import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TasksService {
    constructor(
        private userService: UserService) {}
    private readonly logger = new Logger(TasksService.name);

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        this.logger.debug('Called every minute');
        await this.userService.handleUserConnection();
    }
}
