import { Controller,Get,Post, Body, Response, Request, Param, Next, HttpStatus, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import {FilesInterceptor, MulterModule} from '@nestjs/platform-express';
//import {InjectConnection} from '@nestjs/mongoose';
//import {Connection} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {AuthService} from './auth.service';
import { UsersService} from '../users/users.service'
import {LoginGuard} from './common/loginGuard';
import {AuthenticatedGuard} from './common/authenticate.guard';

import * as passport from 'passport';
import * as fs from 'fs';
import {diskStorage} from 'multer';
import { fileURLToPath } from 'url';
import { PostsService } from 'src/posts/posts.service';
import { CreatePostDto } from 'src/posts/create-post.dto';
 
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


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private usersServ: UsersService, private postsServ: PostsService) {}

    
    //local-signin
    @Get("start")
        async getLocalSignUp( @Response() res){
            res.render('userLogin', {title: "Auth Sign-In Page"});

        }

    //local-signin
    @Get("login")
        async getloginPage( @Response() res){
            res.render('userLogin', {title: "Auth Login Page"});
        }

    //approve local-signin
    @Post("login")
        async localSignIn( @Request() req, @Body() body, @Response() res){
            //passport-> login strategy should be called before this function
            //console.log("got to Auth/Login/:username ");

        if (!body.username || !body.password) {
            res.status(400).send({msg: 'Please pass username and password.'})
            return;
          }
        var username = body.username;
        var pw = body.password;

        try{
            //var oneUser = await this.usersServ.findOne({'local.userName': username});
            var oneUser = req.user //passport should set this already
                if(!oneUser){
                    res.status(404).json({
                        message: "User not found with username " + username
                    });
                    return;
                }

                /*DEBUG
                //if username is found in DB!
                let success = JSON.parse(JSON.stringify(oneUser));
                Object.assign(success, {'currentUser': username, 'title':"first User Profile!"});
                //console.log("Success: ", success);
                */

                // https://stackoverflow.com/questions/19035373/how-do-i-redirect-in-expressjs-while-passing-some-context
                //sending a 200 response b/c ajax only works with 200 =(
               
                //returns user info and client redirects to userProfile page
                //goes through localMiddleWare to load session goodies 1st
                res.status(HttpStatus.OK).send(JSON.stringify(oneUser));   
                return;        
                
            }catch(err){ //user not found err most likely
                console.log("Error in POST auth/login , ", err);
    
                 res.status(404).json({
                    message: "User not found with username " + username
                });
                return;
        
            }
    }

    //async requestJsonWebTokenAfterLocalSignUp(@Req() req: Request): Promise<IToken> {
    //  return await this.authService.createToken(req.user);
    //}
    
  
    //local-signin frontpage
    @Get("signup")
    async localSignUp( @Response() res){
        res.render('userSignup', {title: "User Sign-up Page"});


    }

    //approve local-signup
    @Post("signup")
        async addNewUser( @Request() req, @Body() body, @Response() res){
            //calls passport to authenticate new user 1st
        console.log("INSIDE auth/signup->POST controller")
            

        if (!body.username || !body.password) {
            res.status(400).send({msg: 'Please pass username and password.'})
            return;
          }
        var username = body.username;
        var pw = body.password;

        try{

            //var oneUser = await this.usersServ.findOne({'local.userName': username});
            var oneUser = req.user //passport should already authenticate user
            

            if(oneUser){
                //add user to DB => should be done in passport->AUTH.module
                res.status(200).send({response: 'User found'});
                return;
            }
            else{
                //user didn't get added
                console.log("inside auth-> POST->login after passport auth");
                //send user back to signup page
                res.status(404).send({response: 'Cannot create user. User already created.'});
            }
        }catch(err){
            console.log("Error in POST auth/signup , ", err);

            res.status(404).json({
                message: "User not found with username " + username
            });
            return ;

        }
        console.log("finished auth->POST->passport section");
        
        //res.redirect("/userProfile"); //redirect is not allowed with a POST

        res.json({
            //status value already setup in passport.authenticate
            message: "Auth/signup: Not sure what happened to the new user... "
        });
        return ;
    }//endof sign up

    //async requestJsonWebTokenAfterLocalSignIn(@Req() req: Request): Promise<IToken> {
    //  return await this.authService.createToken(req.user);
    //}
 

    /*Moved to postController
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
            
            // console.log(images);
            // console.log("BODY info: \n")
            // console.log( Object.keys(body));
            // console.log( Object.entries(body));

            // Object.keys(body).forEach(element => {
            //     console.log(element + ": "+body[element]);
            // });
            

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
                userName: req.user['local.userName'],
                files: buffers2Store,
                postDate: new Date()

            }
           console.log("uploading buffers:\n", buffers2Store);

            try {
               var postVal  =  await this.postsServ.create(postInfo); //post attempt value
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


*/

@Get("logout")
async getlogOutPage( @Response() res){
    //Need to clear session keys
    res.render('logout');
}


}
