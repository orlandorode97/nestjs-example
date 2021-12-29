import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dtoRules: any) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before a request is handled
        // console.log('Im running before the handler')

        return next.handle().pipe(
            map((data: any) => {
                return plainToInstance(this.dtoRules, data, {
                    // Share only exposed properties
                    excludeExtraneousValues: true,
                });
            })
        )
    }

}