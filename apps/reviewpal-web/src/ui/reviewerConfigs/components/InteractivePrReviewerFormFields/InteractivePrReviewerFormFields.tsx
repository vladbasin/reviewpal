import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { IntegrationSourceType } from '@reviewpal/common/integrations';
import type { ReviewerConfigArgsIntegrationType, ReviewerConfigArgsType } from '@reviewpal/common/reviewerConfigs';
import type { OptionType } from '@reviewpal/web/ui';
import { useIntegrationsListing, type KeySpecificFormFieldComponentPropsType } from '@reviewpal/web/ui';
import { FormSelectField, FormTextField, useBooleanFieldOptions } from '@reviewpal/web/ui/forms';
import { useCallback } from 'react';

export const InteractivePrReviewerFormFields = ({
  formik,
  isViewing,
}: KeySpecificFormFieldComponentPropsType<ReviewerConfigArgsType>) => {
  const { listAsync } = useIntegrationsListing();
  const loadIntegrationOptions = useCallback(
    (source: IntegrationSourceType) =>
      listAsync(source).onSuccess((integrations): OptionType<ReviewerConfigArgsIntegrationType>[] =>
        integrations.map((t) => ({ id: t.id, label: t.name, value: { id: t.id, source: t.source } }))
      ),
    [listAsync]
  );
  const loadVcsIntegrationsOptions = useCallback(() => loadIntegrationOptions('vcs'), [loadIntegrationOptions]);
  const loadLlmIntegrationsOptions = useCallback(() => loadIntegrationOptions('llm'), [loadIntegrationOptions]);
  const integrationValueToOptionIdMapper = useCallback((value: IdentifiableType) => value.id, []);

  const { options: watermarkOptions, valueToOptionIdMapper: watermarkValueToOptionIdMapper } = useBooleanFieldOptions();

  return (
    <>
      <FormSelectField
        fullWidth
        name="integrations[1]"
        label="VCS integration"
        formik={formik}
        optionsLoader={loadVcsIntegrationsOptions}
        valueToOptionIdMapper={integrationValueToOptionIdMapper}
        disabled={isViewing}
      />
      <FormSelectField
        fullWidth
        name="integrations[0]"
        label="LLM integration"
        formik={formik}
        optionsLoader={loadLlmIntegrationsOptions}
        valueToOptionIdMapper={integrationValueToOptionIdMapper}
        disabled={isViewing}
      />
      <FormTextField
        fullWidth
        name="config.desiredCommentsCountPer100Changes"
        label="Desired comments count per 100 changes"
        type="number"
        formik={formik}
        disabled={isViewing}
      />
      <FormTextField
        fullWidth
        name="config.filesPerPrompt"
        label="Files per prompt"
        type="number"
        formik={formik}
        disabled={isViewing}
      />
      <FormSelectField
        fullWidth
        name="config.isWatermarkEnabled"
        label="Add watermark"
        formik={formik}
        options={watermarkOptions}
        valueToOptionIdMapper={watermarkValueToOptionIdMapper}
        disabled={isViewing}
      />
      <FormTextField
        fullWidth
        name="config.systemPrompt"
        label="System prompt"
        multiline
        minRows={5}
        formik={formik}
        disabled={isViewing}
      />
    </>
  );
};
