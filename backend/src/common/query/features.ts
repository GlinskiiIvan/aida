export class FieldFeatures {
  constructor(
    public readonly filter: boolean = true,
    public readonly search: boolean = true,
    public readonly sort: boolean = true,
  ) {}
}

export const ALL = new FieldFeatures();
export const READ_ONLY = new FieldFeatures(false, false, false);

export const FILTER_ONLY = new FieldFeatures(true, false, false);
export const SEARCH_ONLY = new FieldFeatures(false, true, false);
export const SORT_ONLY = new FieldFeatures(false, false, true);

export const FILTER_SORT = new FieldFeatures(true, false, true);
export const SEARCH_SORT = new FieldFeatures(false, true, true);
export const FILTER_SEARCH = new FieldFeatures(true, true, false);
