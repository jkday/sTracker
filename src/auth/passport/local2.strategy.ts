import { Injectable, UnauthorizedException, Inject, Next } from '@nestjs/common';
import { Model,set,Schema } from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import * as passport from 'passport';
import { Strategy } from 'passport-local';

import { IUser } from '../../users/user.interface';
import * as bcrypt from 'bcryptjs';
//import { generateHashedPassword, generateSalt } from '../../../utilities/encryption';
import { MESSAGES, USER_MODEL_SALT_FACTOR } from '../../server.constants';
import { UserSchema } from 'src/dbs/user/user.schema';


@Injectable()
export class LocalStrategy  {
  constructor(@InjectModel('testuser') private readonly userModel: Model<IUser> ) {
    set('useFindAndModify', false);

    this.init();

  }


  
  private init(): void {

    var thisLSClass = this;

    passport.use('local-signup', new Strategy({
      usernameField: 'username',  //html submission fields
      passwordField: 'password'   //html submission fields
    }, async (username: string, password: string, done: Function) => {
      try {
        if (await this.userModel.findOne({ 'local.userName': username })) {
          return done(new UnauthorizedException(MESSAGES.UNAUTHORIZED_EMAIL_IN_USE), false);
        }

        var saveHashedPW: string;

        password = password.trim();
        console.log("hashing pw in Local Strategy SIGNUP: ",password)
        
        saveHashedPW = bcrypt.hashSync(password, USER_MODEL_SALT_FACTOR);
        if (!saveHashedPW){
              return done("failed to hash password"); 
         }
      //console.log("made new hash pw in local2Strategy!!");
        
              const user: IUser = new thisLSClass.userModel({
                method: 'local',
                local: {
                  userName: username,
                  email: "",
                  hashedPassword: saveHashedPW,
                  salt: ""
                  }
              });

              console.log("Making new user inside local2.strategy!!")
              await user.save();    //used to have an 'await' tag in front of it!

              console.log("finished with making new user");
              done(null, user);
     

      } catch (error) {

        done(error, false);
      }
  }));//endof sigin-up
    


    passport.use('local-login', new Strategy({
        usernameField: 'username',
        passwordField: 'password'
      }, async (username: string, password: string, done: Function) => {
        try {
          const user = await this.userModel.findOne({ 'local.userName': username });
          console.log("user: ", user)
          if (!user) {
            return done(new UnauthorizedException(MESSAGES.UNAUTHORIZED_INVALID_EMAIL), false);
          }
          console.log("PASSPORT->LOGIN compare pws!!")
          password = password.trim();
          var thisClass = this;

          console.log("password: "+bcrypt.hashSync(password, USER_MODEL_SALT_FACTOR));
          console.log("hashPW: ", user.get('local.hashedPassword'));
          /*FIX ME JARED!!! */
          //would like to use Schema.checkPassword here from userSchema.ts 

           bcrypt.compare("test", user.get('local.hashedPassword').trim(), 
                  function(err, isMatched){
                          console.log("compare check", isMatched)
                          if(err){
                            console.log("password match failure", err);
                             return done(err);
                            } else if(isMatched){
                                console.log("password match success finally");
                                return done(null, user); //should set req.user && add user-specific session cookie 
                             }else{
                                return done("Login Failed: Invalid password.", false,
                                { message: "Invalid password." });
                             }
                                                                
                      });
        
          
        } catch (error) {
          done(error, false);
        }

        console.log("PASSPORT -> End of login!!") //should not get here

      }));

    console.log("SETTING UP PASSPORT... inside LOCAL2.Strategy.ts");
    passport.serializeUser(function(user: IUser, done) {
          done(null, user._id); //store in cookie => req.session.passport[user]
      });
  
      passport.deserializeUser(function(id, done) {
          thisLSClass.userModel.findById(id, function(err, user) {
              done(err, user);  //verify unique user
          });
      });
  


    }//endof init

    

private noop(): void {
    return;
}

}//endof LocalStrategy
    

    