import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { randomUUID } from "crypto";

import { AppException } from "src/exceptions/app.exception";
import { enums } from "src/common/response";
import { createResponse } from "../common/response";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const operationCode = request.operationCode ?? enums.CommonCodes.INTERNAL_SERVER_ERROR;

    const traceId = randomUUID();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    console.error({
      traceId,
      operationCode,
      method: request.method,
      url: request.url,
      status,
      exception: exception instanceof HttpException ? exception.getResponse() : exception,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    if (exception instanceof AppException) {
      return response
        .status(status)
        .json(
          createResponse().error(exception.code).errors(exception.errors).traceId(traceId).build(),
        );
    }

    if (exception instanceof HttpException) {
      response.status(status).json(
        createResponse()
          .error(operationCode)
          .errors([
            {
              code: enums.CommonCodes.HTTP_ERROR,
            },
          ])
          .traceId(traceId)
          .build(),
      );
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      createResponse()
        .error(operationCode)
        .errors([
          {
            code: enums.CommonCodes.INTERNAL_SERVER_ERROR,
          },
        ])
        .traceId(traceId)
        .build(),
    );
  }
}
