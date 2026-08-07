import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString } from "class-validator";
import { enums } from "src/common/response";
import { RoleCodes } from "../contracts";

export class UpdatePermissionsDto {
  static validationCode = RoleCodes.UPDATE_PERMISSIONS_ERROR;

  @ApiProperty({ example: [1, 2, 3, 4, 5], description: "Массив разрешений роли", type: [Number] })
  @IsArray({ context: { code: enums.ValidationCodes.ARRAY } })
  @IsInt({ each: true, context: { code: enums.ValidationCodes.NUMBER } })
  readonly permissions: number[];
}
