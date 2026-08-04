import { ResponseStatus, TaskStatus, NotificationLevel, NotificationPresentation } from "./enums";

export type ErrorMeta<TErrorCode extends string = string> = {
  code: TErrorCode;
  field?: string;
  details?: unknown;
};

export type PaginationMeta = {
  total_items: number;
  total_pages: number;
  current_page: number;
};

export type NotificationMeta = {
  id?: string;
  level: NotificationLevel;
  presentation?: NotificationPresentation;
  duration?: number;
};

export type ProcessState<
  TPayload = unknown,
  TStage extends string = string,
  TStep extends string = string,
> = {
  id: string;
  status: TaskStatus;
  stage: TStage;
  step?: TStep;
  payload?: TPayload;
  progress?: {
    current: number;
    total: number;
  };
};

export type ResponseEnvelope<
  TData = unknown,
  TCode extends string = string,
  TErrorCode extends string = string,
  TPayload = unknown,
  TStage extends string = string,
  TStep extends string = string,
> = {
  status: ResponseStatus;
  code: TCode;
  data?: TData;
  errors?: ErrorMeta<TErrorCode>[];
  pagination?: PaginationMeta;
  notify?: NotificationMeta;
  process?: ProcessState<TPayload, TStage, TStep>;
};
