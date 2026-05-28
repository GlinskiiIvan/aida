import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredPermissions) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      if (
        !req.user ||
        !req.user.roles.some((role) => requiredPermissions.includes(role.value))
      ) {
        throw new ForbiddenException({ message: 'Нет доступа' });
      }
      return true;
    } catch (error) {
      throw new ForbiddenException({ message: 'Нет доступа' });
    }
  }
}
