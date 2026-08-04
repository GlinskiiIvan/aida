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
