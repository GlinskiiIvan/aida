import { SetMetadata } from "@nestjs/common";

export const OPERATION_CODE_KEY = "operation:code";

export const OperationCode = (code: string) => SetMetadata(OPERATION_CODE_KEY, code);
