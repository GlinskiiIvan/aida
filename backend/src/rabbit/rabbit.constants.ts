export const RabbitExchange = {
  EVENTS: "events",
} as const;

export const RabbitQueue = {
  STUDY: "study",
  INFERENCE: "inference",
} as const;

export const RabbitRoutingKey = {
  STUDY_PENDING: "study.pending",
  STUDY_PROCESSING: "study.processing",
  STUDY_COMPLETED: "study.completed",
  STUDY_FAILED: "study.failed",

  INFERENCE_PENDING: "inference.pending",
  INFERENCE_PROCESSING: "inference.processing",
  INFERENCE_COMPLETED: "inference.completed",
  INFERENCE_FAILED: "inference.failed",
} as const;
