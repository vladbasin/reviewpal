import type { ObjectRegistry } from '@reviewpal/common/cross-cutting';
import { emptyObject } from '@reviewpal/common/cross-cutting';
import type { FormikHookType } from '@reviewpal/web/ui';
import { EmptyComponent } from '@reviewpal/web/ui';
import type { Maybe } from '@vladbasin/ts-types';
import type { FormikValues } from 'formik';
import type { ComponentType } from 'react';
import { useMemo } from 'react';

export type KeySpecificFormFieldComponentPropsType<TValues extends FormikValues> = {
  formik: FormikHookType<TValues>;
  isViewing: boolean;
};

export type KeySpecificComponentType<TValues extends FormikValues> = ComponentType<
  KeySpecificFormFieldComponentPropsType<TValues>
>;

type UseKeySpecificFormFieldsOptionsType<TValues extends FormikValues> = {
  key: string;
  map: Record<string, Maybe<KeySpecificComponentType<TValues>>>;
  registry: ObjectRegistry;
};

export const useKeySpecificFormFields = <TValues extends FormikValues>({
  key,
  map,
  registry,
}: UseKeySpecificFormFieldsOptionsType<TValues>) => {
  return useMemo(
    () => ({
      defaultValue: registry.get(key)?.defaultValue ?? emptyObject,
      FormFields: map[key] ?? EmptyComponent,
    }),
    [key, map, registry]
  );
};
