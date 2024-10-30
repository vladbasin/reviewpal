import type { IntegrationArgsType } from '@reviewpal/common/integrations';
import type { KeySpecificFormFieldComponentPropsType } from '@reviewpal/web/ui';
import { FormTextField } from '@reviewpal/web/ui/forms';

export const BedrockClaudeIntegrationFormFields = ({
  formik,
  isViewing,
}: KeySpecificFormFieldComponentPropsType<IntegrationArgsType>) => {
  return (
    <>
      <FormTextField fullWidth name="config.awsRegion" label="AWS region" formik={formik} disabled={isViewing} />
      <FormTextField fullWidth name="config.modelId" label="Model ID" formik={formik} disabled={isViewing} />
      <FormTextField
        fullWidth
        name="config.maxTokens"
        label="Max tokens"
        type="number"
        formik={formik}
        disabled={isViewing}
      />
      <FormTextField
        fullWidth
        name="config.anthropicVersion"
        label="Anthropic version"
        formik={formik}
        disabled={isViewing}
      />
    </>
  );
};
