import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { AuthCodes } from "src/auth/contracts";
import { AppException } from "src/exceptions/app.exception";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      if (!req.user || !req.user.roles.some((role) => requiredRoles.includes(role.value))) {
        throw AppException.forbidden(AuthCodes.ACCESS_DENIED);
      }
      return true;
    } catch (error) {
      throw AppException.forbidden(AuthCodes.ACCESS_DENIED);
    }
  }
}
