export type TaskType = "INFERENCE_STUDY" | "UPLOAD_STUDY";

export type TaskStatus = "pending" | "processing" | "completed" | "failed";

export interface TaskMessage {
  task_id: string;
  task_type: TaskType | string;
  status: TaskStatus;
  error?: string;

  progress?: {
    totalImages: number;
    processedImages: number;
    batchSize: number;
    totalBatches: number;
    currentBatch: number;
    batchTime: number;
  };

  images?: {
    total: number;
    current: number;
  };
}
