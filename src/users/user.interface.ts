import {Document} from 'mongoose';


export interface IUser extends Document{
    method: string;
    local:{
     userName: string;
     email: string;
     hashedPassword: string;
    }


}