export class LoginUserDto {
    readonly method: string
    local:{
        email: string;
        userName: string;
        hashedPassword: string;
    }
}