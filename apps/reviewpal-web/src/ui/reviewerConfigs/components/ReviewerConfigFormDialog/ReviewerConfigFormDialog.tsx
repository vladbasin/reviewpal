import { reviewerConfigReviewersRegistry, type ReviewerConfigAdminApiType } from '@reviewpal/common/reviewerConfigs';
import type { OptionType } from '@reviewpal/web/ui';
import { useReviewerConfigForm, useReviewerSpecificFormFields } from '@reviewpal/web/ui';
import { FormDialog, FormSelectField, FormTextField, useFormFieldDefaultValue } from '@reviewpal/web/ui/forms';
import type { Maybe } from '@vladbasin/ts-types';
import { useCallback, useMemo } from 'react';

type ReviewerConfigFormDialogPropsType = {
  target: Maybe<ReviewerConfigAdminApiType>;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item?: ReviewerConfigAdminApiType) => void;
  onDelete?: (item: ReviewerConfigAdminApiType) => void;
};

export const ReviewerConfigFormDialog = ({
  target,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ReviewerConfigFormDialogPropsType) => {
  const reviewerConfigNameGetter = useCallback((reviewerConfig: ReviewerConfigAdminApiType) => reviewerConfig.name, []);

  const { formik, setMode, formRef, isViewing, handleDelete, mode } = useReviewerConfigForm({
    target,
    onSuccess: onClose,
    onEdit,
    onDelete,
  });

  const isCreateOnlyFieldsDisabled = useMemo(() => mode !== 'create', [mode]);

  const reviewerOptions = useMemo(
    (): OptionType<string>[] =>
      reviewerConfigReviewersRegistry.getAllNames().map((reviewer) => ({
        id: reviewer,
        value: reviewer,
        label: reviewer,
      })),
    []
  );
  const reviewerValueToOptionIdMapper = useCallback((value: string) => value, []);

  const { FormFields, defaultValue } = useReviewerSpecificFormFields({ reviewer: formik.values.reviewer });
  useFormFieldDefaultValue({ formik, fieldName: 'config', defaultValue, mode });

  return (
    <FormDialog
      formRef={formRef}
      targetType="ReviewerConfig"
      target={target}
      targetNameGetter={reviewerConfigNameGetter}
      isOpen={isOpen}
      onClose={onClose}
      onModeChanged={setMode}
      formik={formik}
      onDelete={handleDelete}
    >
      <FormTextField fullWidth autoComplete="name" name="name" label="Name" formik={formik} disabled={isViewing} />
      <FormSelectField
        fullWidth
        name="reviewer"
        label="Reviewer"
        formik={formik}
        options={reviewerOptions}
        valueToOptionIdMapper={reviewerValueToOptionIdMapper}
        disabled={isCreateOnlyFieldsDisabled}
      />
      <FormFields formik={formik} isViewing={isViewing} />
    </FormDialog>
  );
};
