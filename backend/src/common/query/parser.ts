import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { QueryParams } from "./schemas";

export function decodeQuery(encoded: string): QueryParams {
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");

    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);

    const decoded = Buffer.from(normalized + padding, "base64").toString("utf-8");

    const data = JSON.parse(decoded);

    const params = plainToInstance(QueryParams, data);

    const errors = validateSync(params);

    if (errors.length > 0) {
      throw new Error();
    }

    return params;
  } catch {
    throw new Error("Invalid query parameter.");
  }
}
