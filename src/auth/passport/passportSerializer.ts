import {PassportSerializer} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {UsersService} from "../../users/users.service";
//import {UserEntity} from "../user/user.entity";

import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import { IUser } from '../../users/user.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: IUser, done: (err: Error | null, user: number) => void): void {
    done(null, user.id);
  }

  deserializeUser(id: String, done: (err: Error | null, payload?: IUser) => void): void {
    this.userService
      .findOne({id})
      .then(user => done(null, user))
      .catch(error => done(error));
  }
}