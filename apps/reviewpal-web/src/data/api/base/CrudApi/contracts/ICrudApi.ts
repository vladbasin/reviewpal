import type { ItemListArgsType } from '@reviewpal/common/cross-cutting';
import type { Result } from '@vladbasin/ts-result';
import type { AnyObject } from 'yup';

export interface ICrudApi<TItem extends AnyObject, TItemArgs = unknown> {
  createAsync(args: TItemArgs): Result<TItem>;
  getAsync(id: string): Result<TItem>;
  listAsync(args: ItemListArgsType<TItem>): Result<TItem[]>;
  updateAsync(id: string, args: TItemArgs): Result<TItem>;
  deleteAsync(id: string): Result<TItem>;
}
