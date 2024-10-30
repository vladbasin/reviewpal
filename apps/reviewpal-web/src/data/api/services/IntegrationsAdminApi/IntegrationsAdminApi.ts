import { HttpClientSid } from '@reviewpal/web/_sids';
import { inject, injectable } from 'inversify';
import type { IIntegrationsAdminApi } from '@reviewpal/web/data';
import { CrudApi, type IHttpClient } from '@reviewpal/web/data';
import { ApiRoutes } from '@reviewpal/common/api';
import type { IntegrationArgsType, IntegrationAdminApiType } from '@reviewpal/common/integrations';

@injectable()
export class IntegrationsAdminApi
  extends CrudApi<IntegrationAdminApiType, IntegrationArgsType>
  implements IIntegrationsAdminApi
{
  public constructor(@inject(HttpClientSid) private readonly _httpClient: IHttpClient) {
    super({
      httpClient: _httpClient,
      createOperation: { route: ApiRoutes.admin.integrations.many },
      getOperation: { route: ApiRoutes.admin.integrations.one },
      listOperation: { route: ApiRoutes.admin.integrations.many },
      updateOperation: { route: ApiRoutes.admin.integrations.one },
      deleteOperation: { route: ApiRoutes.admin.integrations.one },
    });
  }
}
