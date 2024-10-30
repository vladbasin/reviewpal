import type { ObjectSchema } from 'yup';
import { object } from 'yup';
import { IdSchema } from '@reviewpal/common/cross-cutting';

export type IdentifiableType = object & {
  id: string;
};

export const IdentifiableTypeSchema: ObjectSchema<IdentifiableType> = object({
  id: IdSchema,
});
