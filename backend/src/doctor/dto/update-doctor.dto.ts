import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateDoctorDto } from "./create-doctor.dto";
import { DoctorCodes } from "../contracts";

export class UpdateDoctorDto extends PartialType(OmitType(CreateDoctorDto, ["userId"])) {
  static validationCode = DoctorCodes.UPDATE_ERROR;
}
