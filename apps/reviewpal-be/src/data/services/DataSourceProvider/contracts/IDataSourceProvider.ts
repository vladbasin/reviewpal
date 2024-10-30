import type { IInitializable } from '@reviewpal/common/cross-cutting';
import type { DataSource } from 'typeorm';

export interface IDataSourceProvider extends IInitializable {
  provide(): DataSource;
}
