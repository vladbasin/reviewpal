import type { IntegrationAdminApiType } from '@reviewpal/common/integrations';
import type { AsyncDataTableColumnType, AsyncDataTableFooterOptionsType } from '@reviewpal/web/ui';
import {
  AsyncDataTable,
  getIntegrationSourceLabel,
  useItemListDataLoader,
  useIntegrationsAdminApi,
} from '@reviewpal/web/ui';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

type IntegrationsAdminDataTablePropsType = {
  onItemClick?: (item: IntegrationAdminApiType) => void;
  footer?: (options: AsyncDataTableFooterOptionsType<IntegrationAdminApiType>) => ReactNode;
};

export const IntegrationsAdminDataTable = ({ onItemClick, footer }: IntegrationsAdminDataTablePropsType) => {
  const integrationsAdminApi = useIntegrationsAdminApi();

  const columns = useMemo(
    (): AsyncDataTableColumnType<IntegrationAdminApiType>[] => [
      {
        title: 'Name',
        valueGetter: 'name',
        orderableBy: 'name',
        isDefaultOrder: true,
      },
      {
        title: 'Source',
        valueGetter: (integration) => getIntegrationSourceLabel(integration.source),
      },
      {
        title: 'Provider',
        valueGetter: 'provider',
      },
    ],
    []
  );

  const dataLoader = useItemListDataLoader<IntegrationAdminApiType>({
    listAsync: integrationsAdminApi.listAsync.bind(integrationsAdminApi),
    searchFields: ['name'],
  });

  return <AsyncDataTable columns={columns} dataLoader={dataLoader} onItemClick={onItemClick} footer={footer} />;
};
