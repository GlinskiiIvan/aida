import { Module } from "@nestjs/common";
import { DoctorService } from "./doctor.service";
import { DoctorController } from "./doctor.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "src/users/users.module";
import { Doctor } from "./entities/doctor.entity";
import { PatientModule } from "src/patient/patient.module";

@Module({
  controllers: [DoctorController],
  providers: [DoctorService],
  imports: [SequelizeModule.forFeature([Doctor]), UsersModule, PatientModule],
  exports: [DoctorService],
})
export class DoctorModule {}
