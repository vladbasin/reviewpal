import { CrudAdminPage, UserFormDialog, UsersAdminDataTable } from '@reviewpal/web/ui';

export const UsersPage = () => (
  <CrudAdminPage title="Users" DataTableComponent={UsersAdminDataTable} FormComponent={UserFormDialog} />
);
