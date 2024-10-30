import type { AnyObject, ObjectSchema } from 'yup';
import { object, string, array, number, boolean } from 'yup';

export type ItemListArgsType<TItem extends AnyObject> = {
  query?: string;
  searchFields?: string[];
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: OrderDirectionType;
  withDeleted?: boolean;
  withRelations?: boolean;
  filter?: Partial<Record<keyof TItem, unknown>>;
};

export type OrderDirectionType = 'ASC' | 'DESC';

export const ItemListArgsTypeSchema: ObjectSchema<ItemListArgsType<AnyObject>> = object({
  query: string().optional(),
  searchFields: array().of(string().required()).optional(),
  skip: number().optional(),
  take: number().optional(),
  orderBy: string().optional(),
  orderDirection: string().oneOf(['ASC', 'DESC']).optional(),
  withDeleted: boolean().optional(),
  withRelations: boolean().optional(),
  filter: object().optional(),
});
