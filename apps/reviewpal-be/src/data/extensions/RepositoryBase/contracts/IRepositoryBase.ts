import type { ItemListArgsType } from '@reviewpal/common/cross-cutting';
import type { Result } from '@vladbasin/ts-result';
import type { Nullable } from '@vladbasin/ts-types';
import type { ObjectLiteral, Repository, EntityManager } from 'typeorm';

export interface IRepositoryBase<TEntity extends ObjectLiteral> extends Repository<TEntity> {
  transactionAsync<T>(runInTransaction: (entityManager: EntityManager) => Result<T>): Result<T>;
  listAsync(args: ItemListArgsType<TEntity>): Result<TEntity[]>;
  findOneEntityById(id: string): Result<Nullable<TEntity>>;
  findOneEntityByIdOrFail(id: string): Result<TEntity>;

  readonly isSoftDeleteEnabled: boolean;
}
