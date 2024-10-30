import type { Result } from '@vladbasin/ts-result';

export interface IInitializable {
  initializeAsync(): Result<void>;
}
