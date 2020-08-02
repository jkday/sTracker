import {IPost} from './ipost.interface';

export interface IPostsService {
    findAll(serviceName?: string): Promise<IPost[]>;
    findById(ID: number): Promise<IPost | null>;
    findOne(options: object): Promise<IPost | null>;
    create(user: IPost): Promise<IPost>;
    update(ID: number, newValue: IPost): Promise<IPost | null>;
    //delete(ID: number): Promise<string>;

    delete(ID: number):void;

}