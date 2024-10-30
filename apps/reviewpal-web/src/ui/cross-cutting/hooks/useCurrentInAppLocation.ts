import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useCurrentInAppLocation = () => {
  const location = useLocation();

  return useMemo(() => location.pathname + location.search + location.hash, [location]);
};
