import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { enums } from "src/common/response";
import { UserCodes } from "../contracts";

export class UserRoleDto {
  static validationCode = UserCodes.UPDATE_ROLES_ERROR;

  @ApiProperty({ example: 1, description: "ID пользователя" })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly userId: number;

  @ApiProperty({ example: 3, description: "ID роли" })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly roleId: number;
}
