import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// CurrentUser gets the current sign in user set up on CurrentUserInterceptor (request.current_user)
export const CurrentUser = createParamDecorator((data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.current_user;
})