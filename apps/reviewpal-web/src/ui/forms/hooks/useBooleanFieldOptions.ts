import { useMemo } from 'react';

const TrueOptionId = 'true';
const FalseOptionId = 'false';

export const useBooleanFieldOptions = () =>
  useMemo(
    () => ({
      options: [
        { id: TrueOptionId, label: 'Yes', value: true },
        { id: FalseOptionId, label: 'No', value: false },
      ],
      valueToOptionIdMapper: (value: boolean) => (value ? TrueOptionId : FalseOptionId),
    }),
    []
  );
