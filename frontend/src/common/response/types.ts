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

export type ResponseSuccess<
  TData,
  TCode extends string = string,
  TPayload = unknown,
  TStage extends string = string,
  TStep extends string = string,
> = {
  status: ResponseStatus.SUCCESS;
  code: TCode;
  data: TData;
  pagination?: PaginationMeta;
  notify?: NotificationMeta;
  process?: ProcessState<TPayload, TStage, TStep>;
};

export type ResponseError<TCode extends string = string, TErrorCode extends string = string> = {
  status: ResponseStatus.ERROR;
  code: TCode;
  errors: ErrorMeta<TErrorCode>[];
  notify?: NotificationMeta;
  traceId?: string;
};

export type ResponseEnvelope<
  TData,
  TCode extends string = string,
  TErrorCode extends string = string,
  TPayload = unknown,
  TStage extends string = string,
  TStep extends string = string,
> = ResponseSuccess<TData, TCode, TPayload, TStage, TStep> | ResponseError<TCode, TErrorCode>;
