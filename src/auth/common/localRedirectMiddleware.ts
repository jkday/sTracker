import { Injectable, NestMiddleware, BadRequestException, Request, Response, Next } from '@nestjs/common';
//import { Request, Response, NextFunction } from 'express';
import {authenticate} from 'passport';
import { Local3Strategy} from '../passport/local3.strategy';



@Injectable()
//@MiddleWare()
export class localRedirectMiddleware implements NestMiddleware{
   constructor(){}
   async use(@Request() req, @Response() res, @Next() next) {
      //get token and decode or any custom auth logic

      //dont need to manually set req.session.user b/c passport sets session.passport.user
      console.log("inside localredirect")
              
     
      res.locals.currentUser = req.user;  //set by passport 
      delete res.locals.currentUser['local.hashedPassword'];

      //console.log("CURRENTUSER: ", res.locals.currentUser);
      //console.log("CURRENTUSER: ", res.locals.currentUser.name());

      //console.log("res.locals", res.locals)

      next();
                    
            
      }//endof use
      
   
}//endof localRedirect