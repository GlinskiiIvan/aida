import { ResponseStatus } from "./enums";
import { ResponseBuilder } from "./builder";

export function createResponse<
  TData = unknown,
  TCode extends string = string,
  TErrorCode extends string = string,
  TPayload = unknown,
  TStage extends string = string,
  TStep extends string = string,
>() {
  return {
    success: (code: TCode) =>
      new ResponseBuilder<TData, TCode, TErrorCode, TPayload, TStage, TStep>(
        ResponseStatus.SUCCESS,
        code,
      ),

    error: (code: TCode) =>
      new ResponseBuilder<TData, TCode, TErrorCode, TPayload, TStage, TStep>(
        ResponseStatus.ERROR,
        code,
      ),

    accepted: (code: TCode) =>
      new ResponseBuilder<TData, TCode, TErrorCode, TPayload, TStage, TStep>(
        ResponseStatus.ACCEPTED,
        code,
      ),
  };
}
