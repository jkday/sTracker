import { Document } from 'mongoose';

export interface IPost extends Document {
        path: string;
        service: string;
        title: string;
        caption: string;
        userName: string;
        files: Array<Buffer>;
        postDate: Date;
   // readonly userId: string;
}