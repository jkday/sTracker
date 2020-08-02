import { Controller, Res, Response, Request,HttpStatus, Get, Post,Body, 
    UseGuards,UseInterceptors, UploadedFiles} from '@nestjs/common';
import {FilesInterceptor, MulterModule} from '@nestjs/platform-express';

import {IPost} from './ipost.interface';
import {PostsService} from './posts.service';
import {CreatePostDto} from './create-post.dto';
import {postTypes} from '../server.constants';

import {AuthenticatedGuard} from '../auth/common/authenticate.guard';


import * as fs from 'fs';
import {diskStorage} from 'multer';

// multer options that wouldn't load in the @Interceptor 
// You may want to move this variable into a separate file then import it to make it cleaner

const storageOptions = diskStorage({
    destination: "./src/public/uploadDir",  //local storage instead of memoryStorage
    filename: function (req, file, cb) {    //must define filename or multer uses random name
        cb(null, file.originalname);
      }
    
  });
  /*
    sizeFilter = function ( @Request() req, file, callback: Function){

        if(file.size > 5000000){ //less than 5mill bytes
            //req.fileValidationError = 'File Size too big';
            return callback(new Error('File Size too big'), false);
        } 
        return callback(null, true);
    
    }
*/

@Controller('/userProfile/postMgr')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @UseGuards(AuthenticatedGuard)
    @Post()
    async findAllPosts(@Body() body, @Response() res, @Request() req): Promise<IPost[]> {

        console.log("findAllPosts body: ", body)
        //console.log("choosePost req: ", req)
        if(body.pOptions) {

            
        }

        console.log("*** INSIDE UPLOAD| req:", req.user)
        var bodyKeys = ["path", "service", "title", "caption", "userName","postDate"];
        

        if(body.service == undefined || body.service == null){
            //return an error
            res.status(500).send({error: "no service selected"});
        }
        else{
            if(body.service !== ""){//this is a get request inside a post
                //console.log("inside find all posts");
                var oSearch = {}
                bodyKeys.forEach(elem => {
                    if(body[elem])  oSearch[elem] = body[elem];
                });

                oSearch['userName'] = req.user.local['userName'];

                if (body['startDate']){
                    let sDate = new Date(body['startDate']);
                    //need to define oSearch['postDate']
                    oSearch['postDate'] = Object.assign({}, {$gte: sDate});

                }
                if(body['endDate']){
                    let eDate = new Date(body['endDate']);
                    if(oSearch['postDate'] === undefined)
                        oSearch['postDate'] = Object.assign({}, {$lte: eDate});
                        else //oSearch[pDate] is a defined obj
                        Object.assign(oSearch['postDate'], {$lte: eDate});
                }

                var result = await this.postsService.findAll(oSearch);

                if(result){
                    console.log("pController Post: ", result)
                    res.status(200).send(result);
                }

            }
            else{ 
                //this is a create request
                //REMOVE ME, this shouldnt happen...
                var newPostDTO: CreatePostDto = {
                    path: "post controller",
                    service: '\''+body.service+'\'',
                    title:"test title",
                    caption: "default",
                    userName: req.user['local.userName'],
                    postDate: new Date(),
                    files: null,
                }
                try{
                    this.create(newPostDTO, res);
                }catch(err){
                    res.status(500).send("bad prob in posts controller: ", err)
                }
                return res.status(200).send("success!!!")
            }

        }
      

    }//endof Post()



    async create(@Body() createPostDto: CreatePostDto, @Res() res): Promise<IPost>{
        this.postsService.create(createPostDto);

        return res.status(HttpStatus.OK);
        
     
    }

    @Get()
    async findAll(@Request() req, @Response() res, @Body() body): Promise<IPost[]> {
        //check for startDate, endDate, serviceName sent in res.body
        //if(body.service1 == undefined || body.service == null || !postTypes[body.service]){

        /*FIX ME JARED!!!*/
        //change postService.findAll to accept search obj & options obj

            console.log("findAll body: ", body);
            //console.log("findAll res:", req);
        if(body.service == undefined || body.service == null){
            //return an error
            res.status(500).send({error: "no service selected"});
        }
        else{

            //FIX ME JARED
            return this.postsService.findAll(body.service);
        }
    }

    @UseGuards(AuthenticatedGuard)
    @Post("upload")
    @UseInterceptors(FilesInterceptor('uploadPhotos', 12, {     //more options for multer
        fileFilter: function (req, file, callback: Function){
            
            console.log(file.originalname);

            if(file.size > 5000000){ //less than 5mill bytes
                //req.fileValidationError = 'File Size too big';
                return callback(new Error('File Size too big'), false);
            } 
            return callback(null, true);
        
        },
      //  storage: storageOptions

    })) //endof upload controller

        async addNewPost(@UploadedFiles() images, @Response() res, @Request() req, @Body() body){
            //get files from multer

           // console.log(Object.keys(MulterModule));
            console.log("Body: \n", body);

            if(images.length > 12){
                res.status(404).json({
                    message: "Exceeded number of upload files "
                });
                return;
            }
            /*
            console.log(images);
            console.log("BODY info: \n")
            console.log( Object.keys(body));
            console.log( Object.entries(body));

            Object.keys(body).forEach(element => {
                console.log(element + ": "+body[element]);
            });
            */

            var buffers2Store = [];

            images.forEach(  file => {

            
            
            if( file.buffer){   //write from buffer, multer option = memoryStorage

                var data = file.buffer.toString('base64');
                buffers2Store.push( new Buffer(data, 'base64'));

                const path = './src/public/uploadDir/';
                const writeStream = fs.createWriteStream(path + file.originalname);  
                writeStream.write(file.buffer);
                writeStream.end();
            }else{ //saved locally... this is a test HACK

                    let oldpath = file.path;
                    let newpath = "./src/public/uploadDir/test/" +file.originalname;
                              
            //get file from old path and upload to mongoDB


                    if(!fs.existsSync('./src/public/uploadDir/test/')){
                        fs.mkdirSync('./src/public/uploadDir/test/');

                    }
                    console.log ("moving "+ file.path +" to " + newpath);

                     fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        //res.write('File uploaded and moved!');
                        //res.end();
                      });
                      

                   if( fs.existsSync("./src/public/uploadDir/test/"+ file.originalname)){
                    console.log(file.originalname +"  is in uploadDir");
                }

                }//endof else
                
            });//endof forEach file

            var postInfo: CreatePostDto = {
                path: "temp",
                service: body['service_type'],
                title: body['title'],
                caption: body['caption'],
                userName: req.user.local['userName'],
                files: buffers2Store,
                postDate: new Date()

            }
           console.log("uploading buffers:\n", buffers2Store);

            try {
               var postVal  =  await this.postsService.create(postInfo); //post attempt value
                                //returns either a promise or null
                    if (postVal){
                        console.log("Successfully made new post with " + buffers2Store.length + " images");
                         }

                }catch (err){
                    console.error("Error\n", err);

                    res.status(404).json({
                        message: "Post could not be created:  " + err
                    });
                    return;
                }

            var saveLocal = false; //just for testing
        if(saveLocal){
                //assumes files were saved to .\\src\\uploadDir
                //var tmpDir = '.\\src\\uploadDir\\';
                var serviceDir = '.\\src\\uploadDir\\';

                if(body.service_type.toLowerCase().includes("facebook") ){
                    serviceDir = serviceDir + "facebook";
                }else if (body.service_type.toLowerCase().includes("instagram")){
                    serviceDir = serviceDir +"instagram";
                }else if (body.service_type.toLowerCase().includes("web")){
                    serviceDir = serviceDir +"web";
                }else if (body.service_type.toLowerCase().includes("email")){
                    serviceDir = serviceDir + "instagram";
                }
                var timeNow = Date.parse(new Date().toUTCString());
                var timeStr = timeNow/1000;
                console.log("time stamp: "+timeStr);

                images.forEach((file,index) => {
                    var newFname = serviceDir + "\\" + "Post_"+index+"_"+timeStr;

                    if (!fs.existsSync(serviceDir)){
                        fs.mkdirSync(serviceDir);
                    }
                    if(fs.existsSync(file.path)){
                     fs.rename(file.path, newFname, function (err) {
                        if (err) throw err;
                        console.log("moving file "+file.path+" to "+serviceDir)
                       // res.write('File uploaded and moved!');
                       // res.end();
                      });
                    
                    }
    
                });//endof images for loop
      
             }//endof saveLocal

        return res.send( postVal);
        }//addNewPost


    /*
    @Get('myProfile') //users/myProfile
    //async getUser(@Param('username') username, @Response() res): Promise<IUser>{
    async getUser(@Response() res, @Request() req){

        //chec session cookie, and get user info

        //ChANGE THIS TO USE THE USERNAME IN THE SESSION COOKIE
        var userSess;

    if (req.session && req.session.user){
        //res.locals.
        userSess = req.session.user;

    }
    
        console.log("Add code for server-side users data!");
    

    var username = userSess.get('local.username');
    console.log("username: ", username);

    try{
        var oneUser = await this.usersService.findOne({'local.username': username});
        //res.status(200).send({response: 'User found'});
        console.log("oneUser: ", JSON.stringify(oneUser));
        //res.status(HttpStatus.OK).send(JSON.stringify(oneUser));
        
        */

}
