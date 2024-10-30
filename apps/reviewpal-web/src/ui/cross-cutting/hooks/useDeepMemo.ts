import { isEqual } from 'lodash';
import type { DependencyList } from 'react';
import { useEffect, useState } from 'react';

export const useDeepMemo = <T>(valueCreator: () => T, deps: DependencyList): T => {
  const [result, setResult] = useState<T>(valueCreator());

  useEffect(() => {
    const newValue = valueCreator();
    if (!isEqual(newValue, result)) {
      setResult(newValue);
    }
    // We need to ignore the `result` dependency because we want to update the `result` value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueCreator, ...deps]);

  return result;
};
