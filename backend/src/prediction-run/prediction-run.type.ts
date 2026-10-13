export interface PredictionSummary {
  totalImages: number;

  // Эвристические оценки, не клинические вероятности
  tearProbability: number;
  normalProbability: number;

  // Статистика изображений
  imagesWithTear: number;
  normalImages: number;
  imagesWithoutDetection: number;
  unknownImages: number;

  // Статистика обнаружений
  tearDetections: number;
  maxTearConfidence: number;
  meanTearConfidence: number;
}
