import { PartialType } from "@nestjs/swagger";
import { CreatePatientDto } from "./create-patient.dto";
import { PatientCodes } from "../contracts";

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  static validationCode = PatientCodes.UPDATE_ERROR;
}
