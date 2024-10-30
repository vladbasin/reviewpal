import { CrudAdminPage, IntegrationFormDialog, IntegrationsAdminDataTable } from '@reviewpal/web/ui';

export const IntegrationsPage = () => (
  <CrudAdminPage
    title="Integrations"
    DataTableComponent={IntegrationsAdminDataTable}
    FormComponent={IntegrationFormDialog}
  />
);
