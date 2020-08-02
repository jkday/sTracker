import {IUser} from './user.interface';
import {CreateUserDto} from './create-user.dto';

export interface IUsersService {
    findAll(): Promise<IUser[]>;
    findById(ID: number): Promise<IUser | null>;
    findOne(options: object): Promise<IUser | null>;
    create(createUserDto: CreateUserDto): Promise<IUser>;
    update(ID: number, newValue: IUser): Promise<IUser | null>;
    delete(ID: number): Promise<string>;


}