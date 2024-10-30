import type {
  AutocompleteChangeReason,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  AutocompleteValue,
} from '@mui/material';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useFormFieldData, type FormFieldBasePropsType } from '@reviewpal/web/ui';
import type { OptionType } from '@reviewpal/web/ui/cross-cutting';
import { useSnackbarPresenter } from '@reviewpal/web/ui/modals';
import { Result } from '@vladbasin/ts-result';
import type { Maybe } from '@vladbasin/ts-types';
import type { FormikValues } from 'formik';
import { isNil } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

type FormSelectFieldPropsType<
  TValue,
  TMultiple extends Maybe<boolean>,
  TDisableClearable extends Maybe<boolean>,
  TFormikValues extends FormikValues
> = Omit<AutocompleteProps<OptionType<TValue>, TMultiple, TDisableClearable, false>, 'renderInput' | 'options'> &
  FormFieldBasePropsType<TFormikValues> & {
    label?: string;
    options?: readonly OptionType<TValue>[];
    optionsLoader?: () => Result<OptionType<TValue>[]>;
    valueToOptionIdMapper: (value: TValue) => string;
  };

export const FormSelectField = <
  TValue,
  TMultiple extends Maybe<boolean> = false,
  TDisableClearable extends Maybe<boolean> = false,
  TFormikValues extends FormikValues = FormikValues
>({
  name,
  label,
  options,
  optionsLoader,
  valueToOptionIdMapper,
  formik,
  ...restProps
}: FormSelectFieldPropsType<TValue, TMultiple, TDisableClearable, TFormikValues>) => {
  const snackbarPresenter = useSnackbarPresenter();

  const { value, hasError, helperText } = useFormFieldData(name, formik);
  const { setFieldValue, handleBlur } = formik;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [targetOptions, setTargetOptionsInner] = useState<readonly OptionType<TValue>[]>(options ?? []);
  const [idToOptionsMap, setIdToOptionsMap] = useState<Map<string, OptionType<TValue>>>(new Map());

  const setTargetOptions = useCallback((options: readonly OptionType<TValue>[]) => {
    setTargetOptionsInner(options);
    setIdToOptionsMap(new Map(options.map((option) => [option.id, option])));
  }, []);
  const loadOptions = useCallback((): Result<void> => {
    if (!optionsLoader) {
      return Result.Void();
    }

    setIsLoading(true);
    return optionsLoader?.()
      .onSuccess((options) => setTargetOptions(options))
      .onFailureCompensate((error) => snackbarPresenter.present({ message: error, severity: 'error' }))
      .onBoth(() => setIsLoading(false));
  }, [optionsLoader, snackbarPresenter, setTargetOptions]);

  const initializeOptions = useCallback(() => {
    if (optionsLoader) {
      loadOptions().run();
    } else {
      setTargetOptions(options ?? []);
    }
  }, [options, optionsLoader, loadOptions, setTargetOptions]);

  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    initializeOptions();
  }, [initializeOptions]);

  // Populate the options initially, because required to display the initial value
  useEffect(() => initializeOptions(), [initializeOptions]);

  const renderInput = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField
        {...params}
        label={label}
        error={hasError}
        helperText={helperText}
        slotProps={{
          input: {
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          },
        }}
      />
    ),
    [label, isLoading, hasError, helperText]
  );
  const isOptionEqualToValue = useCallback(
    (option: OptionType<TValue>, value: OptionType<TValue>) => option.id === value.id,
    []
  );
  const getOptionLabel = useCallback((option: OptionType<TValue>) => option.label, []);
  const getOptionKey = useCallback((option: OptionType<TValue>) => option.id, []);

  const handleAutocompleteChange = useCallback(
    (
      event: React.SyntheticEvent,
      value: AutocompleteValue<OptionType<TValue>, TMultiple, TDisableClearable, false>,
      reason: AutocompleteChangeReason
    ) => {
      if (reason === 'blur') {
        handleBlur(event);
      } else {
        if (value) {
          setFieldValue(name, Array.isArray(value) ? value.map((v) => v.value) : value?.value, false);
        } else {
          setFieldValue(name, null, false);
        }
      }
    },
    [setFieldValue, handleBlur, name]
  );

  const autocompleteValue = useMemo<
    Maybe<AutocompleteValue<OptionType<TValue>, TMultiple, TDisableClearable, false>>
  >(() => {
    if (isNil(value)) {
      return undefined;
    }

    const valueArray: TValue[] = Array.isArray(value) ? value : [value];

    const result = valueArray.map((val) => {
      const optionId = valueToOptionIdMapper(val);
      return idToOptionsMap.get(optionId) ?? { id: optionId, label: optionId, value: val };
    });

    return (Array.isArray(value) ? result : result[0]) as AutocompleteValue<
      OptionType<TValue>,
      TMultiple,
      TDisableClearable,
      false
    >;
  }, [value, idToOptionsMap, valueToOptionIdMapper]);

  return useMemo(
    () => (
      <Autocomplete<OptionType<TValue>, TMultiple, TDisableClearable, false>
        {...restProps}
        value={autocompleteValue}
        renderInput={renderInput}
        loading={isLoading}
        options={targetOptions}
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={isOptionEqualToValue}
        getOptionLabel={getOptionLabel}
        getOptionKey={getOptionKey}
        onChange={handleAutocompleteChange}
      />
    ),
    [
      restProps,
      autocompleteValue,
      renderInput,
      isLoading,
      targetOptions,
      isOpen,
      handleOpen,
      handleClose,
      isOptionEqualToValue,
      getOptionLabel,
      getOptionKey,
      handleAutocompleteChange,
    ]
  );
};
