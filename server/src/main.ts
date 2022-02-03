import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Logger } from '@nestjs/common';
import { getDbConnectionOptions, runDbMigrations } from '@shared/utils';

const port = process.env.PORT;

async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create(AppModule.forRoot(await
      getDbConnectionOptions(process.env.NODE_ENV)));
    await runDbMigrations();
    await app.listen(port);
    Logger.log(`Server started running onhttp://localhost:${port}`, 'Bootstrap');
  }
bootstrap();
