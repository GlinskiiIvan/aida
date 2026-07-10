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
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredPermissions) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      if(!req.user || !req.user.roles) {
        throw new ForbiddenException({ message: 'Нет доступа' });
      }

      const userPermissions = req.user.permissions;
      console.log('userPermissions', userPermissions);
      
      const hasAccess = requiredPermissions.every(p =>
        userPermissions.includes(p),
      );

      if (!hasAccess) {
        throw new ForbiddenException('Нет доступа');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException({ message: 'Нет доступа' });
    }
  }
}
