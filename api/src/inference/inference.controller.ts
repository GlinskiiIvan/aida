import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { InferenceService } from './inference.service';
import { PredictionRunDto } from './dto/prediction-run.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@ApiBearerAuth('token')
@ApiTags('Выход данных')
@Controller('inference')
export class InferenceController {
  constructor(private readonly inferenceService: InferenceService) {}

  @ApiOperation({ summary: 'Запуск предсказания исследования' })
  @ApiResponse({ status: 200, type: Boolean })
  @Permissions('inference:run')
  @UseGuards(PermissionsGuard)
  @Post('predict/:studyId')
  predict(@Param('studyId') studyId: string, @Body() dto: PredictionRunDto, @Request() req) {
    return this.inferenceService.predict(+studyId, +req.user.id, dto);
  }
}
