import { ResponseStatus } from "./enums";
import {
  ResponseEnvelope,
  NotificationMeta,
  ErrorMeta,
  ProcessState,
  PaginationMeta,
} from "./types";

export class ResponseBuilder<
  TData = unknown,
  TCode extends string = string,
  TErrorCode extends string = string,
  TPayload = unknown,
  TStage extends string = string,
  TStep extends string = string,
> {
  private envelope: ResponseEnvelope<TData, TCode, TErrorCode, TPayload, TStage, TStep>;

  constructor(status: ResponseStatus, code: TCode) {
    this.envelope = {
      status,
      code,
    };
  }

  data(data: TData): this {
    this.envelope.data = data;
    return this;
  }

  pagination(total: number, page_size: number, page: number): this {
    this.envelope.pagination = {
      total_items: total,
      total_pages: page_size ? Math.ceil(total / page_size) : 1,
      current_page: page,
    };
    return this;
  }

  notify(meta: NotificationMeta): this {
    this.envelope.notify = meta;
    return this;
  }

  process(state: ProcessState<TPayload, TStage, TStep>): this {
    this.envelope.process = state;
    return this;
  }

  errors(errors: ErrorMeta<TErrorCode>[]): this {
    this.envelope.errors = errors;
    return this;
  }

  build(): ResponseEnvelope<TData, TCode, TErrorCode, TPayload, TStage, TStep> {
    return this.envelope;
  }
}
