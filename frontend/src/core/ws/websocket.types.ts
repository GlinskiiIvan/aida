export interface TaskMessageIngestionStudy {
  task_id: string;
  task_type: string;
  status: string;

  images: {
    total: number;
    current: number;
  };
}

export interface TaskMessageInferenceStudy {
  task_id: string;
  task_type: string;
  status: string;

  progress?: {
    totalImages: number;
    processedImages: number;
    batchSize: number;
    totalBatches: number;
    currentBatch: number;
    percent: number;
    batchTime: number;
  };
}
