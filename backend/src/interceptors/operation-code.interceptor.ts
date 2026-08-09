import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

import { OPERATION_CODE_KEY } from "src/decorators/operation-code.decorator";

@Injectable()
export class OperationCodeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    request.operationCode = this.reflector.getAllAndOverride<string>(OPERATION_CODE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return next.handle();
  }
}
