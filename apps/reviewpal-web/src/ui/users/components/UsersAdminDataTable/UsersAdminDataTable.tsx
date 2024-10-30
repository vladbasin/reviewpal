import type { UserAdminApiType } from '@reviewpal/common/users';
import type { AsyncDataTableColumnType, AsyncDataTableFooterOptionsType } from '@reviewpal/web/ui';
import { AsyncDataTable, useItemListDataLoader, useUsersAdminApi } from '@reviewpal/web/ui';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

type UsersAdminDataTablePropsType = {
  onItemClick?: (item: UserAdminApiType) => void;
  footer?: (options: AsyncDataTableFooterOptionsType<UserAdminApiType>) => ReactNode;
};

export const UsersAdminDataTable = ({ onItemClick, footer }: UsersAdminDataTablePropsType) => {
  const usersAdminApi = useUsersAdminApi();

  const columns = useMemo(
    (): AsyncDataTableColumnType<UserAdminApiType>[] => [
      {
        title: 'Name',
        valueGetter: 'name',
        orderableBy: 'name',
        isDefaultOrder: true,
      },
      {
        title: 'Email',
        valueGetter: 'email',
      },
      {
        title: 'Role',
        valueGetter: 'role',
      },
    ],
    []
  );

  const dataLoader = useItemListDataLoader<UserAdminApiType>({
    listAsync: usersAdminApi.listAsync.bind(usersAdminApi),
    searchFields: ['name', 'email'],
  });

  return <AsyncDataTable columns={columns} dataLoader={dataLoader} onItemClick={onItemClick} footer={footer} />;
};
