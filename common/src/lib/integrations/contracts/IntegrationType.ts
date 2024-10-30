export enum IntegrationSource {
  llm = 'llm',
  vcs = 'vcs',
}

export type IntegrationSourceType = keyof typeof IntegrationSource;

export type IntegrationType = {
  id: string;
  name: string;
  source: IntegrationSourceType;
  provider: string;
  config: object;
};
