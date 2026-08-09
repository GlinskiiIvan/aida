export enum ResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  ACCEPTED = "accepted",
}

export enum TaskStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum NotificationLevel {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  INFO = "info",
}

export enum NotificationPresentation {
  TOAST = "toast",
  PROGRESS = "progress",
  DIALOG = "dialog",
  BANNER = "banner",
}

export enum ValidationCodes {
  REQUIRED = "validation.required",
  STRING = "validation.string",
  NUMBER = "validation.number",
  EMAIL = "validation.email",
  PHONE = "validation.phone",
  DATE = "validation.date",
  ENUM = "validation.enum",
  BOOLEAN = "validation.boolean",
  ARRAY = "validation.array",
  OBJECT = "validation.object",
  UUID = "validation.uuid",
  MIN_LENGTH = "validation.min_length",
  MAX_LENGTH = "validation.max_length",
  MIN = "validation.min",
  MAX = "validation.max",
  INVALID = "validation.invalid",
  ERROR = "validation.error",
}

export enum CommonCodes {
  INTERNAL_SERVER_ERROR = "common.internal_server_error",
  UNKNOWN_OPERATION = "common.unknown_operation",
  HTTP_ERROR = "common.http_error",
  INVALID_QUERY_PARAMETER = "common.invalid_query_parameter",
}
