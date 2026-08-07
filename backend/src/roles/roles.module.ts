import { forwardRef, Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Role } from "./entities/role.entity";
import { UserRoles } from "src/intermediary-tables/user-roles.entity";
import { User } from "src/users/entities/user.entity";
import { PermissionModule } from "src/permission/permission.module";
import { UsersModule } from "src/users/users.module";

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
    forwardRef(() => UsersModule),
    PermissionModule,
  ],
  exports: [RolesService],
})
export class RolesModule {}
