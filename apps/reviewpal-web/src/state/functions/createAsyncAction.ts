import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ConstructorType } from '@reviewpal/common/cross-cutting';
import { getContainer } from '@reviewpal/web/getContainer';
import type { IAsyncActionExecutor } from '@reviewpal/web/state';

export const createAsyncAction = <TResult = void, TArgs = void>(options: {
  sliceName: string;
  actionName: string;
  Executor: ConstructorType<IAsyncActionExecutor<TResult, TArgs>>;
}): ReturnType<typeof createAsyncThunk<TResult, TArgs>> =>
  createAsyncThunk<TResult, TArgs>(`${options.sliceName}/${options.actionName}`, (args: TArgs) =>
    getContainer().resolve(options.Executor).executeAsync(args).asPromise()
  );
