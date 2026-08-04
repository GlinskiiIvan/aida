import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

import { FilterOperator, FilterValue, SortOrder, SearchMode, GroupOperator } from "./models";

/* -------------------- Filter -------------------- */

export class FilterParams {
  @IsOptional()
  @IsString()
  by?: string;

  @IsOptional()
  @IsEnum(FilterOperator)
  operator?: FilterOperator;

  @IsOptional()
  value?: FilterValue;
}

export class FilterGroup {
  @IsEnum(GroupOperator)
  operator: GroupOperator = GroupOperator.AND;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterParams)
  filters: FilterParams[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterGroup)
  groups: FilterGroup[] = [];
}

/* -------------------- Sorting -------------------- */

export class SortParams {
  @IsOptional()
  @IsString()
  by?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

/* -------------------- Pagination -------------------- */

export class PaginationParams {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  page_size?: number;

  get enabled(): boolean {
    return this.page !== undefined && this.page_size !== undefined;
  }

  get offset(): number | undefined {
    if (!this.enabled) {
      return undefined;
    }

    return (this.page! - 1) * this.page_size!;
  }
}

export type ResolvedPagination = {
  page: number;
  page_size: number;
};

/* -------------------- Search -------------------- */

@ValidatorConstraint({ name: "searchByOrFields", async: false })
class SearchByOrFieldsValidator implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const obj = args.object as SearchParams;
    return !(obj.by && obj.fields);
  }

  defaultMessage(): string {
    return "'by' and 'fields' cannot be used together.";
  }
}

export class SearchParams {
  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  by?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsEnum(SearchMode)
  mode?: SearchMode;

  get enabled(): boolean {
    return this.value !== undefined;
  }

  @Validate(SearchByOrFieldsValidator)
  private readonly _validator?: never;
}

/* -------------------- Query -------------------- */

export class QueryParams {
  @ValidateNested()
  @Type(() => SearchParams)
  search: SearchParams = new SearchParams();

  @ValidateNested()
  @Type(() => FilterGroup)
  filters: FilterGroup = new FilterGroup();

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortParams)
  sorting: SortParams[] = [];

  @ValidateNested()
  @Type(() => PaginationParams)
  pagination: PaginationParams = new PaginationParams();
}

/* -------------------- Result -------------------- */

export class QueryResult<T> {
  data!: T[];

  total_items!: number;
  total_pages!: number;
  current_page!: number;
}
