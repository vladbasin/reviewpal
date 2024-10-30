import { CrudAdminPage, ReviewerConfigFormDialog, ReviewerConfigsAdminDataTable } from '@reviewpal/web/ui';

export const ReviewerConfigsPage = () => (
  <CrudAdminPage
    title="Reviewers"
    DataTableComponent={ReviewerConfigsAdminDataTable}
    FormComponent={ReviewerConfigFormDialog}
  />
);
