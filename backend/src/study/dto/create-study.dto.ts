import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "src/common/enums";
import { enums } from "src/common/response";
import { StudyCodes } from "../contracts";

export class CreateStudyDto {
  static validationCode = StudyCodes.CREATE_ERROR;

  @ApiProperty({ example: 1, description: "Уникальный ID пациента" })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly patientId: number;

  @ApiProperty({
    example: Status.Completed,
    description: "Статус обработки",
    enum: Object.values(Status),
  })
  @IsEnum(Status, { context: { code: enums.ValidationCodes.ENUM } })
  readonly status: Status;

  @ApiProperty({ example: "Странные колени", description: "Заметка", required: false })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly note?: string;
}
