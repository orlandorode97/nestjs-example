import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from '../users.service';

/*
    CurrentUserInterceptor injects the user service in order to retrieve the
    session.user_id and find the current user, then if a user exists it is set up
    in the current request
*/
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userService: UsersService){}

    async intercept(context: ExecutionContext, next: CallHandler) {
        const request = context.switchToHttp().getRequest() // getting the incoming request information
        const {user_id} = request.session || {} // get the user_id from the request.session
        if(user_id) {
            const user = await this.userService.findOne(user_id) // find by user_id in case a truly value
            request.current_user = user; // attach user info into the current request
        }
        return next.handle()
    }
}