import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateSeriesDto } from "./create-series.dto";
import { Modality, Orientation, Protocol, Status } from "src/common/enums";
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { enums } from "src/common/response";
import { SeriesCodes } from "../contracts";

export class UpdateSeriesDto extends PartialType(OmitType(CreateSeriesDto, ["studyId", "id"])) {
  static validationCode = SeriesCodes.UPDATE_ERROR;

  @ApiProperty({ example: "SE000007", description: "Номер серии", required: false })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly seriesNumber?: string;

  @ApiProperty({
    example: Modality.MR,
    description: "Модальность серии",
    enum: Object.values(Modality),
    required: false,
  })
  @IsOptional()
  @IsEnum(Modality, { context: { code: enums.ValidationCodes.ENUM } })
  readonly modality?: Modality;

  @ApiProperty({
    example: Protocol.PD,
    description: "Протокол серии",
    enum: Object.values(Protocol),
    required: false,
  })
  @IsOptional()
  @IsEnum(Protocol, { context: { code: enums.ValidationCodes.ENUM } })
  readonly protocol?: Protocol;

  @ApiProperty({
    example: Orientation.Sagittal,
    description: "Ориентация серии",
    enum: Object.values(Orientation),
    required: false,
  })
  @IsOptional()
  @IsEnum(Orientation, { context: { code: enums.ValidationCodes.ENUM } })
  readonly orientation?: Orientation;

  @ApiProperty({ example: 13, description: "Количество снимков в серии", required: false })
  @IsOptional()
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly imagesCount?: number;

  @ApiProperty({
    example: {
      studyInstanceUID: "1.2.840.113619.2.55.3.604688433.1234.1678901234.567",
      seriesCount: 3,
      imagesCount: 120,
      modality: "MR",
      bodyPartExamined: "KNEE",
      manufacturer: "Siemens",
    },
    description:
      "Сырые метаданные серии (например, данные из DICOM: UID исследования, количество снимков, модальность, область исследования и оборудование)",
    required: false,
  })
  @IsOptional()
  @IsObject({ context: { code: enums.ValidationCodes.OBJECT } })
  readonly rawMetadata?: JSON;

  @ApiProperty({
    example: "Представим, что это описание всего исследования.",
    description: "Описание",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly description?: string;

  @ApiProperty({
    example: Status.Pending,
    description: "Статус обработки",
    enum: Object.values(Status),
    required: false,
  })
  @IsOptional()
  @IsEnum(Status, { context: { code: enums.ValidationCodes.ENUM } })
  readonly status?: Status;
}
