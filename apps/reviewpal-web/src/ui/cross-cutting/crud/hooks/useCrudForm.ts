import type { IdentifiableType } from '@reviewpal/common/cross-cutting';
import type { ICrudApi } from '@reviewpal/web/data';
import {
  createOnSubmitHandler,
  useConfirmPresenter,
  useDeepMemo,
  useExecuteWithLoader,
  useFullScreenLoaderPresenter,
  useValidateYupSchema,
  type FormModeType,
} from '@reviewpal/web/ui';
import type { FormikValues } from 'formik';
import { useFormik } from 'formik';
import { isNil } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ObjectSchema } from 'yup';

export type UseCrudFormExternalOptionsType<TTarget extends IdentifiableType> = {
  target?: TTarget;
  onSuccess?: () => void;
  onEdit?: (target?: TTarget) => void;
  onDelete?: (target: TTarget) => void;
};

type UseCrudFormOptionsType<
  TTarget extends IdentifiableType,
  TTargetArgs extends FormikValues
> = UseCrudFormExternalOptionsType<TTarget> & {
  api: ICrudApi<TTarget, TTargetArgs>;
  schema: ObjectSchema<TTargetArgs>;
  getInitialValues: (target?: TTarget) => TTargetArgs;
};

export const useCrudForm = <TTarget extends IdentifiableType, TTargetArgs extends FormikValues>(
  options: UseCrudFormOptionsType<TTarget, TTargetArgs>
) => {
  const { target, api, getInitialValues, schema, onSuccess, onEdit, onDelete } = options;

  const [mode, setMode] = useState<FormModeType>('view');
  const isViewing = mode === 'view';
  const formRef = useRef<HTMLElement>(null);

  const fullScreenLoaderPresenter = useFullScreenLoaderPresenter();
  const confirmPresenter = useConfirmPresenter();
  const executeWithLoader = useExecuteWithLoader();

  const initialValues = useDeepMemo<TTargetArgs>(() => getInitialValues(target), [target, getInitialValues]);

  const validateYupSchema = useValidateYupSchema();

  const formik = useFormik<TTargetArgs>({
    initialValues,
    validate: (values) => validateYupSchema(values, schema),
    onSubmit: createOnSubmitHandler(
      (values) =>
        (mode === 'update' && !isNil(target)
          ? api.updateAsync(target.id, values).onSuccess((result) => onEdit?.(result))
          : api.createAsync(values).onSuccess(() => onEdit?.())
        ).onSuccess(() => {
          resetForm({ values });
          onSuccess?.();
        }),
      fullScreenLoaderPresenter,
      formRef
    ),
  });

  const { resetForm } = formik;
  useEffect(() => resetForm({ values: initialValues, errors: {} }), [initialValues, resetForm]);

  const handleDelete = useCallback(
    () =>
      target &&
      confirmPresenter
        .presentYesNoAsync({
          message: 'Are you sure you want to delete this?',
        })
        .onSuccess((isConfirmed) => {
          if (isConfirmed) {
            executeWithLoader({
              executor: () =>
                api.deleteAsync(target.id).onSuccess(() => {
                  onSuccess?.();
                  onDelete?.(target);
                }),
              errorBehavior: 'showSnackbar',
            });
          }
        })
        .run(),
    [target, onSuccess, onDelete, api, confirmPresenter, executeWithLoader]
  );

  return useMemo(
    () => ({ formik, handleDelete, mode, setMode, isViewing, formRef }),
    [formik, handleDelete, setMode, mode, isViewing]
  );
};
