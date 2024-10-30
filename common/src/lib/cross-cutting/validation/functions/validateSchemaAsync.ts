import type { Maybe, AnyObject, ObjectSchema } from 'yup';
import { Result } from '@vladbasin/ts-result';

export const validateSchemaAsync = <T extends Maybe<AnyObject>>(target: T, schema: ObjectSchema<T>) => {
  return Result.FromPromise(schema.validate(target));
};
