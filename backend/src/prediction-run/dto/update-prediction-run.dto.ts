import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreatePredictionRunDto } from "./create-prediction-run.dto";
import { IsEnum, IsOptional } from "class-validator";
import { Status } from "src/common/enums";
import { enums } from "src/common/response";
import { PredictionRunCodes } from "../contracts";

export class UpdatePredictionRunDto extends PartialType(
  OmitType(CreatePredictionRunDto, ["studyId", "createdById"]),
) {
  static validationCode = PredictionRunCodes.UPDATE_ERROR;

  @ApiProperty({
    example: Status.Pending,
    description: "Статус обработки",
    enum: Object.values(Status),
    required: false,
  })
  @IsOptional()
  @IsEnum(Status, { context: { code: enums.ValidationCodes.ENUM } })
  readonly status?: Status;
}
