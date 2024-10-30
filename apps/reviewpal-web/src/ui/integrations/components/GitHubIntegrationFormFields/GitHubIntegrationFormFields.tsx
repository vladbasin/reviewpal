import type { IntegrationArgsType } from '@reviewpal/common/integrations';
import type { KeySpecificFormFieldComponentPropsType } from '@reviewpal/web/ui';
import { FormTextField } from '@reviewpal/web/ui/forms';

export const GitHubIntegrationFormFields = ({
  formik,
  isViewing,
}: KeySpecificFormFieldComponentPropsType<IntegrationArgsType>) => {
  return (
    <FormTextField fullWidth name="config.token" label="Token" type="password" formik={formik} disabled={isViewing} />
  );
};
