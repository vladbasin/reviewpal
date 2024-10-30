import type { ObjectSchema } from 'yup';
import { number, object, string } from 'yup';

export type PrFileType = {
  sha: string;
  filename: string;
  status: PrFileStatusType;
  patch: string;
  changes: number;
};

export enum PrFileStatus {
  added = 'added',
  removed = 'removed',
  modified = 'modified',
  renamed = 'renamed',
  copied = 'copied',
  changed = 'changed',
  unchanged = 'unchanged',
}

export type PrFileStatusType = keyof typeof PrFileStatus;

export const PrFileTypeSchema: ObjectSchema<PrFileType> = object({
  sha: string().required().label('Sha'),
  filename: string().required().label('Filename'),
  status: string().oneOf(Object.values(PrFileStatus)).required().label('Status'),
  patch: string().required().label('Patch'),
  changes: number().required().label('Changes'),
});
