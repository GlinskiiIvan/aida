import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { enums } from "src/common/response";
import { RoleCodes } from "../contracts";

export class CreateRoleDto {
  static validationCode = RoleCodes.CREATE_ERROR;

  @ApiProperty({ example: "admin", description: "Название роли" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly value: string;

  @ApiProperty({ example: "Роль обладающая полным доступом", description: "Описание роли" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly description: string;
}
