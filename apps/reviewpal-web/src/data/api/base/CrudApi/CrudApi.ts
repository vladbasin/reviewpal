import type { ItemListArgsType } from '@reviewpal/common/cross-cutting';
import { formatRouteWithParams, processError } from '@reviewpal/web/cross-cutting';
import { getApiUrl, type ICrudApi, type IHttpClient } from '@reviewpal/web/data';
import type { Result } from '@vladbasin/ts-result';
import type { AnyObject } from 'yup';

type CrudApiOperationType = {
  route: string;
  customErrorsMap?: Record<string, string>;
};

type CrudApiOptions = {
  httpClient: IHttpClient;
  createOperation?: CrudApiOperationType;
  getOperation?: CrudApiOperationType;
  listOperation?: CrudApiOperationType;
  updateOperation?: CrudApiOperationType;
  deleteOperation?: CrudApiOperationType;
};

export class CrudApi<TItem extends AnyObject, TItemArgs = unknown> implements ICrudApi<TItem, TItemArgs> {
  public constructor(private readonly _options: CrudApiOptions) {}

  public createAsync(args: TItemArgs): Result<TItem> {
    const { createOperation, httpClient } = this._options;

    if (!createOperation) {
      throw new Error('Create operation is not enabled');
    }

    const { route, customErrorsMap } = createOperation;

    return httpClient
      .sendJsonDataRequestAsync<TItem>({
        url: getApiUrl(route),
        method: 'PUT',
        withCredentials: true,
        data: args,
      })
      .withProcessedFailError((error) => processError(error, customErrorsMap));
  }

  public getAsync(id: string): Result<TItem> {
    const { getOperation, httpClient } = this._options;

    if (!getOperation) {
      throw new Error('Get operation is not enabled');
    }

    const { route, customErrorsMap } = getOperation;

    return httpClient
      .sendJsonDataRequestAsync<TItem>({
        url: getApiUrl(formatRouteWithParams(route, { id })),
        method: 'GET',
        withCredentials: true,
      })
      .withProcessedFailError((error) => processError(error, customErrorsMap));
  }

  public listAsync(args: ItemListArgsType<TItem>): Result<TItem[]> {
    const { listOperation, httpClient } = this._options;

    if (!listOperation) {
      throw new Error('List operation is not enabled');
    }

    const { route, customErrorsMap } = listOperation;

    const isSearchingByQuery = args.query;
    const data = {
      ...args,
      query: isSearchingByQuery ? args.query : undefined,
      searchFields: isSearchingByQuery ? args.searchFields : undefined,
    };

    return httpClient
      .sendJsonDataRequestAsync<TItem[]>({
        url: getApiUrl(route),
        method: 'POST',
        withCredentials: true,
        data,
      })
      .withProcessedFailError((error) => processError(error, customErrorsMap));
  }

  public updateAsync(id: string, args: TItemArgs): Result<TItem> {
    const { updateOperation, httpClient } = this._options;

    if (!updateOperation) {
      throw new Error('Update operation is not enabled');
    }

    const { route, customErrorsMap } = updateOperation;

    return httpClient
      .sendJsonDataRequestAsync<TItem>({
        url: getApiUrl(formatRouteWithParams(route, { id })),
        method: 'PATCH',
        withCredentials: true,
        data: args,
      })
      .withProcessedFailError((error) => processError(error, customErrorsMap));
  }

  public deleteAsync(id: string): Result<TItem> {
    const { deleteOperation, httpClient } = this._options;

    if (!deleteOperation) {
      throw new Error('Delete operation is not enabled');
    }

    const { route, customErrorsMap } = deleteOperation;

    return httpClient
      .sendJsonDataRequestAsync<TItem>({
        url: getApiUrl(formatRouteWithParams(route, { id })),
        method: 'DELETE',
        withCredentials: true,
      })
      .withProcessedFailError((error) => processError(error, customErrorsMap));
  }
}
