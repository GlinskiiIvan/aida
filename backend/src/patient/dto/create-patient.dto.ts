import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { enums } from "src/common/response";
import { PatientCodes } from "../contracts";

export class CreatePatientDto {
  static validationCode = PatientCodes.CREATE_ERROR;

  @ApiProperty({ example: "Странные колени", description: "Заметка", required: false })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly note?: string;
}
