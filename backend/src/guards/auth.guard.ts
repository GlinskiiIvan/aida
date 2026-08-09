import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
import { RolesService } from "src/roles/roles.service";
import { QueryParams } from "src/common/query";
import { AppException } from "src/exceptions/app.exception";
import { AuthCodes } from "src/auth/contracts";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private roleService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      if (bearer !== "Bearer" || !token) {
        throw AppException.unauthorized(AuthCodes.AUTHENTICATION_REQUIRED);
      }

      const user = this.jwtService.verify(token, {
        secret: process.env.ACCESS_SECRET,
      });

      const roles = user.roles;
      const permissionsArrays = await Promise.all(
        roles.map(async (role) => {
          const { data } = await this.roleService.findAllPermissions(role.id, new QueryParams());
          return data ?? [];
        }),
      );

      const permissions = [...new Set(permissionsArrays.flat().map((p) => p.value))];

      req.user = {
        ...user,
        permissions,
      };

      return true;
    } catch (error) {
      throw AppException.unauthorized(AuthCodes.AUTHENTICATION_REQUIRED);
    }
  }
}
