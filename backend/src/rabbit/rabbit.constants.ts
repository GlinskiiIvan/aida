export const RabbitExchange = {
  EVENTS: "events",
  BACKEND: "backend",
  WORKER: "worker",
} as const;

export const RabbitQueue = {
  STUDY: "study",
  INFERENCE: "inference",
  BACKEND: "backend",
  WORKER: "worker",
} as const;

export const RabbitRoutingKey = {
  STUDY_PENDING: "study.pending",
  STUDY_PROCESSING: "study.processing",
  STUDY_COMPLETED: "study.completed",
  STUDY_FAILED: "study.failed",

  INFERENCE_REQUEST: "inference.request",
  INFERENCE_PENDING: "inference.pending",
  INFERENCE_PROCESSING: "inference.processing",
  INFERENCE_COMPLETED: "inference.completed",
  INFERENCE_FAILED: "inference.failed",
} as const;

export type RabbitQueue = (typeof RabbitQueue)[keyof typeof RabbitQueue];

export type RabbitRoutingKey = (typeof RabbitRoutingKey)[keyof typeof RabbitRoutingKey];

export type RabbitExchange = (typeof RabbitExchange)[keyof typeof RabbitExchange];
