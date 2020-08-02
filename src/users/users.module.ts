import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {UserSchema} from '../dbs/user/user.schema';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'testuser', schema:UserSchema}], 'localtest')
  ],
  
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService,MongooseModule.forFeature([{name: 'testuser', schema:UserSchema}])],
})
export class UsersModule {}
