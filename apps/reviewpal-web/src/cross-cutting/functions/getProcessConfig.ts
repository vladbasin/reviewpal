import { isNil } from 'lodash';

export const getProcessConfig = (key: string): string => {
  const configKey = `NX_PUBLIC_${key}`;
  const config = process.env[configKey];

  if (isNil(config)) {
    throw new Error(`${configKey} is not defined`);
  }

  return config;
};
