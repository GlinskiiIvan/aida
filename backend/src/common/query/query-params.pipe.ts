import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { QueryParams } from "./schemas";
import { decodeQuery } from "./parser";

@Injectable()
export class QueryParamsPipe implements PipeTransform {
  transform(value: string | undefined): QueryParams {
    if (!value) {
      return new QueryParams();
    }

    try {
      return decodeQuery(value);
    } catch {
      throw new BadRequestException("Invalid query parameter.");
    }
  }
}
