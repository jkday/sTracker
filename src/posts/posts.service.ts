import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';

import {IPost} from './ipost.interface';
import {IPostsService} from './ipost.service';
import {CreatePostDto} from './create-post.dto';
import {PostSchema} from '../dbs/post.schema';

//import {POST_MODEL_PROVIDER} from '../constants';


@Injectable()
export class PostsService implements IPostsService{
    constructor(@InjectModel('post') private readonly postModel: Model<IPost> = new Model(PostSchema)) {}


    async create(createPostDto: CreatePostDto): Promise<IPost> {
        const createdPost = new this.postModel(createPostDto);
        return await createdPost.save();


    }

    async findAll(oSearch: Object, postOpt?: Object): Promise<IPost[]> {
        try{
            /*let v = '\''+oSearch+'\'';
            console.log("v: ",v);
            */

            var jsonSearch = JSON.stringify(oSearch);
            //console.log(jsonSearch);
            console.log("search string: ", oSearch);
            var test;

            if(postOpt !== {} && postOpt !== undefined && postOpt !== null){
                var jsonOpt = JSON.stringify(postOpt);
                test = await this.postModel.find(oSearch).sort(postOpt).exec();

            }
        //return await this.postModel.find({service: v}).exec();
        //await this.postModel.find({key: value}).sort({key:-1}).exec()
            else{
                test = await this.postModel.find(oSearch).sort({postDate:-1}).exec();
                console.log("else test ouput: ", test);
             }

        return test;
        // await this.postModel.find().exec();

        }catch(err){
            console.log( err, 'PostService.findAll error');

        }
    }
    
    
    async findById(ID: number): Promise<IPost | null>{
        return await this.postModel.findById(ID).exec();
    }

    async find(options: object): Promise<IPost[] | null>{
//list option types here...

        try{

            var myPost: IPost[] = await this.postModel.find(options).exec();
            console.log("Post Service=> myPost: ", myPost);
            return myPost;

        }catch(err){
            console.log( err, 'PostService.find error');

        }
    }


    async findOne(options: object): Promise<IPost | null>{
        try{

            var myPost = await this.postModel.findOne(options).exec();
            console.log("Post Service.findOne=> myPost: ", myPost);
            return myPost;
        }catch(err){
            console.log( err, 'PostService.findOne error');
            return null;
        }
    }
    update(ID: number, newValue: IPost): Promise<IPost | null>{

        return null;
    }
    //delete(ID: number): Promise<string>{
    delete(ID: number): void{

    }

}//endof PostsService
