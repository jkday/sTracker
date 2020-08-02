import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ApptsService } from './appts/appts.service';
import { LoginController } from './login/login.controller';
import { SignupController } from './signup/signup.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import {MulterModule} from '@nestjs/platform-express';


@Module({
  imports: [UsersModule,
          MongooseModule.forRoot('mongodb://localhost:27017/db',{
            connectionName: 'localtest',
          }),
          //MulterModule.register({dest: 'C:\\Users\\gotta\\Documents\\Tools\\NestTest\\scheduler\\pic-loader\\src\\public\\uploadDir'}),
          MulterModule.register({dest: '.\\src\\public\\uploadDir'}),

          PostsModule,
          AuthModule
  ],
  controllers: [AppController, LoginController, SignupController],
  providers: [AppService, ApptsService],
})
export class AppModule {}
