import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest() // get the current request
        return request.session.user_id // falsy or truly value in case the user_id is presented in the request.
    }
}