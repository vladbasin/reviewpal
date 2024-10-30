import type { UserAdminApiType } from '@reviewpal/common/users';

export type InteractivePrUserAnalyticsAdminApiType = {
  id: string;
  userId: string;
  user: UserAdminApiType;
  reviews: number;
  codeSuggestions: number;
  publishedComments: number;
  discussions: number;
  inputTokens: number;
  outputTokens: number;
};
