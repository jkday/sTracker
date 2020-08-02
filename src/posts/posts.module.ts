import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import {MongooseModule} from '@nestjs/mongoose';
import {PostSchema} from '../dbs/post.schema';




@Module({
  imports: [
    MongooseModule.forFeature([{name: 'post', schema:PostSchema}], 'localtest')
  ],

  controllers: [PostsController],
  providers: [PostsService],
  exports: [
    PostsService,
    //MongooseModule.forFeature([{name: 'post', schema:PostSchema}], 'localtest')
  ],

})
export class PostsModule {}
