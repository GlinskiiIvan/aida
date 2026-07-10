import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionModule } from 'src/permission/permission.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from 'src/permission/entities/permission.entity';

@Module({
  providers: [SeedService],
  imports: [
    SequelizeModule.forFeature([Permission]),
    RolesModule, 
    UsersModule, 
    AuthModule, 
    PermissionModule
  ]
})
export class SeedModule {}