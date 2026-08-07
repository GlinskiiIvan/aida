import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateInstanceImageDto } from "./create-instance-image.dto";
import { InstanceImageCodes } from "../contracts";

export class UpdateInstanceImageDto extends PartialType(
  OmitType(CreateInstanceImageDto, ["seriesId"]),
) {
  static validationCode = InstanceImageCodes.UPDATE_ERROR;
}
