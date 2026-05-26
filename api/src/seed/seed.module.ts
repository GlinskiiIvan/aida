import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [SeedService],
  imports: [RolesModule, UsersModule, AuthModule]
})
export class SeedModule {}