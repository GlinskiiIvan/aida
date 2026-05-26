import type { ComponentSize, TextColors } from "../types";
import type { IconMap } from "./Icon.map";

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends string
        ? K & string
        : Join<K & string, Paths<T[K]>>;
    }[keyof T]
  : never;

export type IconSize = ComponentSize | 'inherit';
export type IconColor = TextColors | 'inherit';
export type IconPath = Paths<typeof IconMap>;