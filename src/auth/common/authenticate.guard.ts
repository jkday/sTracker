import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log("CHECKING AUTHENTICATION...\n", Object.getOwnPropertyNames(request));
    console.log("*****\n", request._passport)
    console.log("*****\n",request.isAuthenticated)
    return request.isAuthenticated();
  }
}