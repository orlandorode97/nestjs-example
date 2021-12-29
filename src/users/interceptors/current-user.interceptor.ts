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
        const request = context.switchToHttp().getRequest()
        const {user_id} = request.session || {}
        if(user_id) {
            const user = await this.userService.findOne(user_id)
            request.current_user = user;
        }
        return next.handle()
    }
}