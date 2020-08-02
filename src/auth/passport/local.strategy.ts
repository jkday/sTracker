import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import { Strategy } from 'passport-local';

import { IUser } from '../../users/user.interface';
import * as bcrypt from 'bcrypt-nodejs';
//import { generateHashedPassword, generateSalt } from '../../../utilities/encryption';
import { MESSAGES, USER_MODEL_TOKEN,USER_MODEL_SALT_FACTOR } from '../../server.constants';



mongoose.set('useFindAndModify', false);

function noop() {
    return;
}


@Injectable()
export class LocalStrategy {
  constructor(
    @Inject(USER_MODEL_TOKEN) private readonly userModel: Model<IUser> ) {
    this.init();
  }


  
  private init(): void {
    passport.use('local-signup', new Strategy({
      usernameField: 'userName',
      passwordField: 'hashedPassword'
    }, async (username: string, password: string, done: Function) => {
      try {
        if (await this.userModel.findOne({ 'local.username': username })) {
          return done(new UnauthorizedException(MESSAGES.UNAUTHORIZED_EMAIL_IN_USE), false);
        }

        var saveHashedPW: string;

        bcrypt.hash(password, USER_MODEL_SALT_FACTOR, noop, function(err, hashedPW) {
            if (err) { return done(err); }
            saveHashedPW = hashedPW;
        });
        
        const user: Model<IUser> = new this.userModel({
          method: 'local',
          local: {
            username: username,
            email: "",
            hashedPassword: saveHashedPW
                  }
        });

        await user.save();

        done(null, user);
      } catch (error) {
        done(error, false);
      }
        }));//endof sigin-up
    


    passport.use('local-signin', new Strategy({
        usernameField: 'userName',
        passwordField: 'hashedPassword'
      }, async (username: string, password: string, done: Function) => {
        try {
          const user: IUser = await this.userModel.findOne({ 'local.userName': username });
  
          if (!user) {
            return done(new UnauthorizedException(MESSAGES.UNAUTHORIZED_INVALID_EMAIL), false);
          }
  

          bcrypt.compare(password, user.local.hashedPassword, function(err, isMatch) {
            done(err, isMatch);
        });

          
        } catch (error) {
          done(error, false);
        }
      }));
    }//endof init
}//endof LocalStrategy
    

    