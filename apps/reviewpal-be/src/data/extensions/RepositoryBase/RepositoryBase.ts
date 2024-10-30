import type { IDataSourceProvider, IRepositoryBase } from '@reviewpal/be/data';
import { NotFoundError, type ItemListArgsType } from '@reviewpal/common/cross-cutting';
import { Result } from '@vladbasin/ts-result';
import type { Nullable } from '@vladbasin/ts-types';
import type {
  EntityManager,
  EntityMetadata,
  EntityTarget,
  FindOptionsWhere,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { Brackets, Repository } from 'typeorm';

const EntityAlias = 'entity';
const EntityAliasSeparator = '.';

export abstract class RepositoryBase<TEntity extends ObjectLiteral>
  extends Repository<TEntity>
  implements IRepositoryBase<TEntity>
{
  public constructor(
    protected readonly _dataSourceProvider: IDataSourceProvider,
    protected readonly _entityTarget: EntityTarget<TEntity>
  ) {
    super(_entityTarget, _dataSourceProvider.provide().createEntityManager());
  }

  public listAsync({
    query,
    searchFields,
    skip,
    take,
    orderBy,
    orderDirection,
    withDeleted,
    withRelations,
    filter,
  }: ItemListArgsType<TEntity>): Result<TEntity[]> {
    let queryBuilder = this.createQueryBuilder(EntityAlias);

    if (withRelations === true) {
      queryBuilder = this.queryRelations(queryBuilder, withDeleted === true);
    }

    if (query) {
      queryBuilder = this.queryPartialMatch(queryBuilder, searchFields, query);
    }

    if (filter) {
      queryBuilder = this.queryFilter(queryBuilder, filter);
    }

    if (this.metadata.deleteDateColumn) {
      if (withDeleted === true) {
        queryBuilder = queryBuilder.withDeleted();
      }
    }

    if (orderBy) {
      queryBuilder = queryBuilder.orderBy(this.getValidFieldPath(String(orderBy)), orderDirection);
    }

    if (skip) {
      queryBuilder = queryBuilder.skip(skip);
    }

    if (take) {
      queryBuilder = queryBuilder.take(take);
    }

    return Result.FromPromise(queryBuilder.getMany());
  }

  public transactionAsync<T>(runInTransaction: (entityManager: EntityManager) => Result<T>): Result<T> {
    return Result.FromPromise(
      this._dataSourceProvider.provide().transaction<T>((manager) => runInTransaction(manager).asPromise())
    );
  }

  public findOneEntityById(id: unknown): Result<Nullable<TEntity>> {
    const relations = this.metadata.relations.flatMap(({ propertyName, inverseEntityMetadata }) => [
      propertyName,
      ...inverseEntityMetadata.relations
        .filter((inverseRelation) => inverseRelation.inverseEntityMetadata.tablePath !== this.metadata.tablePath)
        .map((inverseRelation) => `${propertyName}.${inverseRelation.propertyName}`),
    ]);

    const softDeleteRelatedParams = this.isSoftDeleteEnabled ? { withDeleted: true } : {};

    return Result.FromPromise(
      this.findOne({
        where: { id } as FindOptionsWhere<TEntity>,
        relations,
        ...softDeleteRelatedParams,
      })
    );
  }

  public findOneEntityByIdOrFail(id: unknown): Result<TEntity> {
    return this.findOneEntityById(id).ensureUnwrap((entity) => entity, NotFoundError);
  }

  public get isSoftDeleteEnabled(): boolean {
    return !!this.metadata.deleteDateColumn;
  }

  private queryRelations(
    queryBuilder: SelectQueryBuilder<TEntity>,
    withDeletedRoot = false,
    alias: string = EntityAlias,
    metadata = this.metadata,
    visited: Set<string> = new Set()
  ): SelectQueryBuilder<TEntity> {
    metadata.relations.forEach((relation) => {
      if (visited.has(relation.propertyName)) {
        return;
      }
      visited.add(relation.propertyName);

      const inverseSide = relation.inverseEntityMetadata;
      const joinColumns = relation.isOwning ? relation.joinColumns : relation.inverseRelation?.joinColumns ?? [];
      let joinCondition = '';

      const leftAlias = relation.isOwning ? alias : relation.propertyName;
      const rightAlias = relation.isOwning ? relation.propertyName : alias;

      if (joinColumns.length > 0) {
        joinCondition = joinColumns
          .map((column) => {
            return inverseSide.primaryColumns
              .map((primaryColumn) => {
                return `${leftAlias}.${column.propertyName} = ${rightAlias}.${primaryColumn.propertyName}`;
              })
              .join(' AND ');
          })
          .join(' AND ');

        queryBuilder = queryBuilder.withDeleted();

        if (alias === EntityAlias && metadata.deleteDateColumn && !withDeletedRoot) {
          queryBuilder = queryBuilder.andWhere(`${alias}.${metadata.deleteDateColumn.propertyName} IS NULL`);
        }

        queryBuilder = queryBuilder.leftJoinAndSelect(
          `${alias}.${relation.propertyPath}`,
          relation.propertyName,
          joinCondition
        );
      }

      if (inverseSide.relations.length > 0) {
        queryBuilder = this.queryRelations(queryBuilder, withDeletedRoot, relation.propertyName, inverseSide, visited);
      }
    });

    return queryBuilder;
  }

  private queryPartialMatch(
    queryBuilder: SelectQueryBuilder<TEntity>,
    searchFields: (keyof TEntity | string)[] | undefined,
    query: string
  ): SelectQueryBuilder<TEntity> {
    const partialMatchQuery = query
      ?.split(' ')
      .map((chunk) => `%${chunk}%`)
      .join(' ');

    const whereMatches =
      (partialMatchQuery
        ? searchFields?.map((field) => ({
            condition: `${this.getValidFieldPath(String(field))} ILIKE :partialMatchQuery`,
            params: { partialMatchQuery },
          }))
        : []) ?? [];

    queryBuilder = queryBuilder.where(
      new Brackets((qb) => {
        whereMatches.reduce(
          (qb, { condition, params }, index) =>
            index === 0 ? qb.where(condition, params) : qb.orWhere(condition, params),
          qb
        );
      })
    );

    return queryBuilder;
  }

  private queryFilter(
    queryBuilder: SelectQueryBuilder<TEntity>,
    filter: Partial<Record<keyof TEntity, unknown>>
  ): SelectQueryBuilder<TEntity> {
    return Object.entries(filter).reduce((qb, [key, value]) => {
      const validFieldPath = this.getValidFieldPath(String(key));
      const paramId = this.getParameterId(validFieldPath);
      qb.andWhere(`${validFieldPath} = :${paramId}`, { [paramId]: value });
      return qb;
    }, queryBuilder);
  }

  private getParameterId(key: string): string {
    return key.replace(/\W/g, '');
  }

  private getValidFieldPath(path: string, metadata: EntityMetadata = this.metadata, isRoot = true): string {
    const [field, subfield] = path.split(EntityAliasSeparator);

    if (!subfield) {
      const fieldMetadata = metadata.columns.find((column) => column.propertyName === field);
      if (!fieldMetadata) {
        throw new Error(`Invalid field: ${field}`);
      }

      return isRoot ? `${EntityAlias}${EntityAliasSeparator}${field}` : field;
    } else {
      const fieldMetadata = metadata.relations.find((relation) => relation.propertyName === field);
      if (!fieldMetadata) {
        throw new Error(`Invalid field: ${field}`);
      }

      return `${field}${EntityAliasSeparator}${this.getValidFieldPath(
        subfield,
        fieldMetadata.inverseEntityMetadata,
        false
      )}`;
    }
  }
}
