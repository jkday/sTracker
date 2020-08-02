import {ExecutionContext, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class LoginGuard extends AuthGuard("local-login") {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    console.log("INSIDE LGuard: ", result)
    const request = context.switchToHttp().getRequest();
    console.log("INSIDE LGuard: ", Object.keys(request));

    await super.logIn(request);
    
    return result;
  }
}