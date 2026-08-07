import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { enums } from "src/common/response";
import { PermissionCodes } from "../contracts";

export class CreatePermissionDto {
  static validationCode = PermissionCodes.CREATE_ERROR;

  @ApiProperty({ example: "patient:create", description: "Значение разрешения" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly value: string;

  @ApiProperty({
    example: "Разрешение на создание пациента",
    description: "Описание разрешения",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly description?: string;
}
