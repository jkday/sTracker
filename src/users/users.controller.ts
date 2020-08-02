import { Controller, Get, Param, Post, Body, Query, Response, Request, HttpStatus} from '@nestjs/common';
import { UsersService } from './users.service';
import {IUser} from './user.interface';
import bodyParser = require('body-parser');


@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

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
            
            let data = JSON.stringify(oneUser);
            res.render('userProfile', {testVar:'testUserABC'}, function (err, html){
                res.status(HttpStatus.OK).send(html);
            });
           
           
            // res.status(HttpStatus.OK).render('userProfile',{user:'testUserABC'});
           
           
            //return oneUser;

        }catch(err){
            console.log("Error in GET Users/:id , ", err);

            res.status(404).json({
                message: "User not found with username " + username
            });

            res.status(500).send(JSON.stringify(oneUser));


        }
 
        res.status(500);
    //    return oneUser; 




    }//endof getUser

    @Post()
    async makePost(@Body() body, @Response() res){
        /*
        const dbResult = await this.usersService.makePost(body, res);
        if(dbResult == null){
            return res.status(409).json({
                message: "Appoinment time is already taken on " + body.date + " at time: " + body.tod
            });
        }else{
             res.send(dbResult);
        }
        */
    }

}
