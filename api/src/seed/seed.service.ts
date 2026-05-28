import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PermissionService } from 'src/permission/permission.service';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import permissionsJson from './data/permissions.json';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
    private readonly permissionService: PermissionService,
    @InjectModel(Permission) private permissionRepository: typeof Permission,
  ) {}

  async onModuleInit() {
    await this.seedPermissions();
    await this.seedRoles();
    await this.seedAdmin();
  }

  private async seedRoles() {
    const count = await this.rolesService.count();

    if (count > 0) return;

    await this.rolesService.create({
        value: 'admin',
        description: 'Роль обладающая полным доступом'
    });
    await this.rolesService.create({
        value: 'doctor',
        description: 'Роль обладающая правами доктора'
    });
  }

  private async seedAdmin() {
    const count = await this.usersService.count();

    if (count > 0) return;

    const admin = await this.authService.registration({
        email: 'admin@admin.kz',
        password: 'admin'
    });

    const adminRole = await this.rolesService.findOneByValue("admin");

    await this.usersService.addRole({
        roleId: adminRole.id,
        userId: admin.user.id
    })
  }

  private async seedPermissions() {
    const count = await this.permissionService.count();

    if(count > 0) return;

    await this.permissionRepository.bulkCreate(permissionsJson);
  }
}