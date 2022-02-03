import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';

@Module({})
export class AppModule {
    static forRoot(connOptions: ConnectionOptions): DynamicModule {
      return {
        module: AppModule,
        controllers: [AppController],
        imports: [
          TypeOrmModule.forRoot(connOptions),
          TodoModule],
        providers: [AppService],
      };
    }
}

// @Module({ // do not compile YET
//   imports: [
//     TodoModule,
//     TypeOrmModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

// @Module({}) // GET / return 404
// export class AppModule {
//   static forRoot(): DynamicModule {
//     return {
//       module: AppModule,
//       controllers: [AppController],
//       imports: [
//         TodoModule,
//         TypeOrmModule,
//       ],
//       providers: [AppService],
//     };
//   }
// }
