import { Controller,Get,Post, Res, Request, Param, HttpStatus,Next } from '@nestjs/common';

import {InjectModel} from '@nestjs/mongoose';
import {UsersService} from '../users/users.service';
import {IUser} from '../users/user.interface';
import {CreateUserDto} from '../users/create-user.dto';

import * as passport from 'passport';


//import { User,WebUserModel } from '../dbs/appt/appt.model'; //DB Model used to talk to MongoDB

@Controller('login')
export class LoginController {
    constructor(private readonly usersService: UsersService) {}

    @Post(':username')
        //async getLoginProfile( @Param('username') username, @Request() req, @Res() res): Promise <IUser>{
            async getLoginProfile( @Param('username') username, @Request() req, @Res() res, @Next() next){

            console.log("INSIDE POST /login/username getLoginProfile");
            console.log("username: ", username);

            console.log(Object.keys(passport.Passport));

            passport.authenticate("local-login", {
                failureRedirect: "/login",
                failureFlash: true
                },

                function(req, res) {
                    console.log("start authentication here...");
                 // return res.status(HttpStatus.OK).send({message: "good job"});

                    res.redirect('/userProfile');
                  }
                );
                console.log("finished LOGIN controller");

            /*
               passport.authenticate("login", function(err, user, info){
                if (err) { 
                    console.log("ERROR: inside login, passport")
                    return next(err); }

                if (!user) {
                     //return res.redirect('/login');
                     return res.status(404).json({
                        message: "User not found with username " + username
                    });
                     }

                     req.logIn(user, function(err) {
                        if (err) { return next(err); }
                        //return res.redirect('/users/' + user.username);
                     res.status(HttpStatus.OK).send(JSON.stringify(user));
                      });

               })(req, res, next);

               */
            /*
            try{
                var oneUser = await this.usersService.findOne({'username': username});
                //res.status(200).send({response: 'User found'});

                if(!oneUser){
                    res.status(404).json({
                        message: "User not found with username " + username
                    });
                }

                console.log("oneUser: ", JSON.stringify(oneUser));
                console.log(oneUser);

                if(!oneUser){
                    res.status(404).json({
                        message: "User not found with username " + username
                    });
                }
                //res.status(HttpStatus.OK).send(JSON.stringify(oneUser));
                
                //if username is found in DB!
                let success = JSON.parse(JSON.stringify(oneUser));
                Object.assign(success, {'currentUser': username, 'title':"first User Profile!"});
                console.log("Success: ", success);
                //res.render('userProfile', {'currentUser': username, 'title':"first User Profile!"});

/// FIX ME JARED!!! 
                //need to put results from query into session variable!!
                // https://stackoverflow.com/questions/19035373/how-do-i-redirect-in-expressjs-while-passing-some-context
                //sending a 200 response b/c ajax only works with 200 =(
                
                //Good return command!!
                //res.status(HttpStatus.OK).send(JSON.stringify(oneUser));   
                               
                //$.AJAX POST won't work with redirect or render properly
                //return res.redirect(302,'userProfile');

                res.render('userProfile', {testVar:'testUserABC'}); //returns the rendered html to the ajax call
               //res.send('<script>window.location.href="your URL";</script>');




            }catch(err){
                console.log("Error in POST Users/:id , ", err);
    
                res.status(404).json({
                    message: "User not found with username " + username
                });
        
            }
    
            //res.status(500).send(JSON.stringify(oneUser));
            //res.status(HttpStatus.OK).send(oneUser);
            */
         }

}
