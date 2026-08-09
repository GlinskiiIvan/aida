import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { AppException } from "src/exceptions/app.exception";
import { ErrorMeta } from "src/common/response";
import { enums } from "src/common/response";

type ValidationDtoClass = {
  new (...args: any[]): any;
  validationCode?: string;
};

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private mapErrors(errors: ValidationError[]): ErrorMeta[] {
    const result: ErrorMeta[] = [];

    const walk = (items: ValidationError[], parent?: string) => {
      for (const error of items) {
        const field = parent ? `${parent}.${error.property}` : error.property;

        if (error.constraints) {
          for (const constraint of Object.keys(error.constraints)) {
            const contextCode = error.contexts?.[constraint]?.code;

            result.push({
              code: contextCode ?? enums.ValidationCodes.INVALID,
              field,
            });
          }
        }

        if (error.children?.length) {
          walk(error.children, field);
        }
      }
    };

    walk(errors);

    return result;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const metatype = metadata.metatype as ValidationDtoClass | undefined;

    if (!metatype) {
      return value;
    }

    const dto = plainToInstance(metatype, value);

    const errors = await validate(dto);

    if (errors.length) {
      const code = metatype?.validationCode ?? enums.ValidationCodes.ERROR;

      throw AppException.validation(code, this.mapErrors(errors));
    }

    return dto;
  }
}
