import { Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';

import { authenticate } from 'passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Local3Strategy} from './passport/local3.strategy';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import { Request, Response, NextFunction } from 'express';
import { localRedirectMiddleware} from './common/localRedirectMiddleware';

//new stuff 6/11
import {MongooseModule} from '@nestjs/mongoose';
import {PostSchema} from '../dbs/post.schema';

//integrating nest passport wrapper
import {PassportModule} from '@nestjs/passport';



@Module({
  imports: [
    UsersModule,PostsModule, PassportModule,
    MongooseModule.forFeature([{name: 'testuser', schema:PostSchema}], 'localtest')
  ],
  controllers: [AuthController],
  providers: [AuthService, Local3Strategy]
})

// You must explicitly consume the Middlewares in your Modules
export class AuthModule implements NestModule{
  
  public configure(consumer: MiddlewareConsumer){
    consumer.apply(
       
     // (req,res, next) => {
         authenticate('local-signup',{session: true, //successRedirect : '/userProfile',
            failureRedirect : '/usersignup'}),   
            localRedirectMiddleware
      ).forRoutes({path:'/auth/signup',method: RequestMethod.POST});
      

      consumer.apply(
          authenticate('local-login',{session: true, failureRedirect:'/'}),
            localRedirectMiddleware
        ).forRoutes({path: '/auth/login', method: RequestMethod.POST},{path: 'login/*', method: RequestMethod.POST});
     }


}
