import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString } from "class-validator";
import { enums } from "src/common/response";
import { UserCodes } from "../contracts";

export class UpdateRolesDto {
  static validationCode = UserCodes.UPDATE_ROLES_ERROR;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
    description: "Массив ролей пользователя",
    type: [Number],
  })
  @IsArray({ context: { code: enums.ValidationCodes.ARRAY } })
  @IsInt({ each: true, context: { code: enums.ValidationCodes.NUMBER } })
  readonly roles: number[];
}
