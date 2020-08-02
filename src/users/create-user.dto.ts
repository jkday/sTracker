export class CreateUserDto {
    readonly method: string
    local:{
        email: string;
        userName: string;
        hashedPassword: string;
        password: string;
    }
    

}