export const Gender = {
  Male: 'male',
  Female: 'female',
} as const;

export const Status = {
  Pending: 'pending',
  Processing: 'processing',
  Completed: 'completed',
  Failed: 'failed',
} as const;

export const Modality = {
  MR: 'MR',
  CT: 'CT',
  XR: 'XR',
  US: 'US',
} as const;

export const Orientation = {
  Axial: 'axial',
  Coronal: 'coronal',
  Sagittal: 'sagittal',
  ObliqueCut: 'oblique cut',
} as const;

export const Protocol = {
  T1: 'T1',
  T2: 'T2',
  PD: 'PD',
}

export const ResultClass = {
  Normal: 'normal',
  Tear: 'tear',
} as const;

export const Models = {
  YOLO: 'YOLO',
} as const;

export const Context = {
  CREATE: 'create',
  UPDATE: 'update'
} as const;

export const Action = {
  ADD: 'add',
  EDIT: 'edit',
  REMOVE: 'remove'
} as const;

export const Permission = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
} as const;

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;


export type Gender = typeof Gender[keyof typeof Gender];
export type Status = typeof Status[keyof typeof Status];
export type Modality = typeof Modality[keyof typeof Modality];
export type Orientation = typeof Orientation[keyof typeof Orientation];
export type Protocol = typeof Protocol[keyof typeof Protocol];
export type ResultClass = typeof ResultClass[keyof typeof ResultClass];
export type Models = typeof Models[keyof typeof Models];
export type SortOrder = typeof SortOrder[keyof typeof SortOrder];
