import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "src/decorators/permissions.decorator";
import { AppException } from "src/exceptions/app.exception";
import { AuthCodes } from "src/auth/contracts";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredPermissions) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      if (!req.user || !req.user.roles) {
        throw AppException.forbidden(AuthCodes.ACCESS_DENIED);
      }

      const userPermissions = req.user.permissions;
      console.log("userPermissions", userPermissions);

      const hasAccess = requiredPermissions.every((p) => userPermissions.includes(p));

      if (!hasAccess) {
        throw AppException.forbidden(AuthCodes.ACCESS_DENIED);
      }

      return true;
    } catch (error) {
      throw AppException.forbidden(AuthCodes.ACCESS_DENIED);
    }
  }
}
