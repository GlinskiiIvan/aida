import { PartialType } from "@nestjs/swagger";
import { CreatePermissionDto } from "./create-permission.dto";
import { PermissionCodes } from "../contracts";

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  static validationCode = PermissionCodes.UPDATE_ERROR;
}
