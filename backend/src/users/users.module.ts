import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./entities/user.entity";
import { RolesModule } from "src/roles/roles.module";
import { Role } from "src/roles/entities/role.entity";
import { UserRoles } from "src/intermediary-tables/user-roles.entity";
import { PredictionRunModule } from "src/prediction-run/prediction-run.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles]),
    forwardRef(() => RolesModule),
    PredictionRunModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
