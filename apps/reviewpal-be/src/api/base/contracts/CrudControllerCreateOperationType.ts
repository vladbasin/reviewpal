import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { CrudControllerOperationType, SuccessHandleResult } from '@reviewpal/be/api';
import type { ObjectSchema } from 'yup';
import type { Result } from '@vladbasin/ts-result';
import type { Request, Response } from 'express';

type CrudControllerCreateOperationOverrideArgsType<TEntity extends IdentifiableType, TEntityArgs extends object> = {
  args: TEntityArgs;
  entity: TEntity;
  operation: CrudControllerCreateOperationType<TEntity, TEntityArgs>;
  req: Request;
  res: Response;
};

export type CrudControllerCreateOperationType<
  TEntity extends IdentifiableType,
  TEntityArgs extends object
> = CrudControllerOperationType & {
  schema: ObjectSchema<TEntityArgs>;
  mapArgsToEntityAsync: (args: TEntityArgs) => Result<TEntity>;
  validateArgsAsync?: (args: TEntityArgs) => Result<void>;
  overrideAsync?: (
    args: CrudControllerCreateOperationOverrideArgsType<TEntity, TEntityArgs>
  ) => Result<SuccessHandleResult>;
};
