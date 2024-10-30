import {
  integrationProvidersRegistry,
  IntegrationSource,
  type IntegrationAdminApiType,
  type IntegrationSourceType,
} from '@reviewpal/common/integrations';
import type { OptionType } from '@reviewpal/web/ui';
import { getIntegrationSourceLabel, useIntegrationForm, useIntegrationSpecificFormFields } from '@reviewpal/web/ui';
import { FormDialog, FormSelectField, FormTextField, useFormFieldDefaultValue } from '@reviewpal/web/ui/forms';
import type { Maybe } from '@vladbasin/ts-types';
import { useCallback, useMemo } from 'react';

type IntegrationFormDialogPropsType = {
  target: Maybe<IntegrationAdminApiType>;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item?: IntegrationAdminApiType) => void;
  onDelete?: (item: IntegrationAdminApiType) => void;
};

export const IntegrationFormDialog = ({
  target,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: IntegrationFormDialogPropsType) => {
  const integrationNameGetter = useCallback((integration: IntegrationAdminApiType) => integration.name, []);

  const { formik, setMode, formRef, isViewing, handleDelete, mode } = useIntegrationForm({
    target,
    onSuccess: onClose,
    onEdit,
    onDelete,
  });

  const sourceOptions = useMemo(
    (): OptionType<IntegrationSourceType>[] =>
      Object.values(IntegrationSource).map((source) => ({
        id: source,
        value: source,
        label: getIntegrationSourceLabel(source),
      })),
    []
  );
  const sourceValueToOptionIdMapper = useCallback((value: IntegrationSourceType) => value, []);

  const isCreateOnlyFieldsDisabled = useMemo(() => mode !== 'create', [mode]);

  const providerOptions = useMemo(
    (): OptionType<string>[] =>
      integrationProvidersRegistry
        .getAll()
        .filter((provider) => provider.source === formik.values.source)
        .map(({ name }) => ({
          id: name,
          value: name,
          label: name,
        })),
    [formik.values.source]
  );
  const providerValueToOptionIdMapper = useCallback((value: string) => value, []);

  const { FormFields, defaultValue } = useIntegrationSpecificFormFields({ provider: formik.values.provider });
  useFormFieldDefaultValue({ formik, fieldName: 'config', defaultValue, mode });

  return (
    <FormDialog
      formRef={formRef}
      targetType="Integration"
      target={target}
      targetNameGetter={integrationNameGetter}
      isOpen={isOpen}
      onClose={onClose}
      onModeChanged={setMode}
      formik={formik}
      onDelete={handleDelete}
    >
      <FormTextField fullWidth autoComplete="name" name="name" label="Name" formik={formik} disabled={isViewing} />
      <FormSelectField
        fullWidth
        name="source"
        label="Source"
        formik={formik}
        options={sourceOptions}
        valueToOptionIdMapper={sourceValueToOptionIdMapper}
        disabled={isCreateOnlyFieldsDisabled}
      />
      <FormSelectField
        fullWidth
        name="provider"
        label="Provider"
        formik={formik}
        options={providerOptions}
        valueToOptionIdMapper={providerValueToOptionIdMapper}
        disabled={isCreateOnlyFieldsDisabled}
      />
      <FormFields formik={formik} isViewing={isViewing} />
    </FormDialog>
  );
};
