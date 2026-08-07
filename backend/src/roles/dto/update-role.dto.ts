import { PartialType } from "@nestjs/swagger";
import { CreateRoleDto } from "./create-role.dto";
import { RoleCodes } from "../contracts";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  static validationCode = RoleCodes.UPDATE_ERROR;
}
