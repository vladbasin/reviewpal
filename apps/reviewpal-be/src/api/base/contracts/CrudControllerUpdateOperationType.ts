import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { CrudControllerOperationType, SuccessHandleResult } from '@reviewpal/be/api';
import type { ObjectSchema } from 'yup';
import type { Result } from '@vladbasin/ts-result';

export type CrudControllerUpdateOperationType<
  TEntity extends IdentifiableType,
  TEntityArgs extends object
> = CrudControllerOperationType & {
  schema: ObjectSchema<TEntityArgs>;
  // Someone may want to send fields that are not allowed to be updated, because of business logic
  // This function should be used to filter out those fields
  selectArgs: (args: TEntityArgs, existingEntity: TEntity) => TEntityArgs;
  validateArgsAsync?: (args: TEntityArgs, existingEntity: TEntity) => Result<void>;
  mapArgsToEntityAsync: (args: TEntityArgs, existingEntity: TEntity) => Result<TEntity>;
  overrideAsync?: (
    args: TEntityArgs,
    existingEntity: TEntity,
    operation: CrudControllerUpdateOperationType<TEntity, TEntityArgs>
  ) => Result<SuccessHandleResult>;
};
