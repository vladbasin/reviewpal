import type { PrFileType } from '@reviewpal/common/integrations';

export type PrType = {
  latestCommitHash: string;
  files: PrFileType[];
};
