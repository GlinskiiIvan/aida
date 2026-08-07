import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { enums } from "src/common/response";
import { InstanceImageCodes } from "../contracts";

export class CreateInstanceImageDto {
  static validationCode = InstanceImageCodes.CREATE_ERROR;

  @ApiProperty({
    example: "0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21",
    description: "Уникальный ID серии",
  })
  @IsUUID("7", { context: { code: enums.ValidationCodes.UUID } })
  readonly seriesId: string;

  @ApiProperty({
    example: "00005-dd5595a4.png",
    description: "Название изображения",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly imageName?: string | null;

  @ApiProperty({ example: 4, description: "Последоватльный номер изображения в серии" })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  instanceNumber: number;

  @ApiProperty({
    example: {
      "SOP Instance UID": "1.2.840.113619.2.312.6945.201972.14618.14619.1",
      "Instance Number": "5",
      Rows: 512,
      Columns: 512,
      "Photometric Interpretation": "MONOCHROME2",
      "Bits Allocated": 16,
      "Bits Stored": 12,
      "High Bit": 11,
      "Pixel Representation": 0,
      "Image Position (Patient)": [0.0, 0.0, -50.0],
      "Image Orientation (Patient)": [1.0, 0.0, 0.0, 0.0, 1.0, 0.0],
      "Slice Thickness": 5.0,
      "Pixel Spacing": [0.9765625, 0.9765625],
      Modality: "MR",
    },
    description:
      "Сырые метаданные конкретного изображения (Instance) в DICOM. Включает все ключевые теги уровня изображения, такие как позиция, ориентация, размеры и параметры пикселей.",
  })
  @IsObject({ context: { code: enums.ValidationCodes.OBJECT } })
  readonly rawMetadata: JSON;
}
