import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorMeta } from "src/common/response";

export type AppExceptionOptions = {
  status?: HttpStatus;
  code: string;
  errors?: ErrorMeta[];
};

export class AppException extends HttpException {
  readonly code: string;
  readonly errors: ErrorMeta[];

  constructor(options: AppExceptionOptions) {
    super(options.code, options.status ?? HttpStatus.BAD_REQUEST);

    this.code = options.code;
    this.errors = options.errors ?? [];
  }

  static validation(code: string, errors: ErrorMeta[]): AppException {
    return new AppException({
      status: HttpStatus.BAD_REQUEST,
      code,
      errors,
    });
  }

  static notFound(code: string): AppException {
    return new AppException({
      status: HttpStatus.NOT_FOUND,
      code,
    });
  }

  static conflict(code: string, errors?: ErrorMeta[]): AppException {
    return new AppException({
      status: HttpStatus.CONFLICT,
      code,
      errors,
    });
  }

  static internal(code: string): AppException {
    return new AppException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code,
    });
  }

  static unauthorized(code: string, errors?: ErrorMeta[]): AppException {
    return new AppException({
      status: HttpStatus.UNAUTHORIZED,
      code,
      errors,
    });
  }

  static forbidden(code: string, errors?: ErrorMeta[]): AppException {
    return new AppException({
      status: HttpStatus.FORBIDDEN,
      code,
      errors,
    });
  }
}
