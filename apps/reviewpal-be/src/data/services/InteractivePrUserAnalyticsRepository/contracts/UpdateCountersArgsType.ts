import type { InteractivePrUserAnalyticsEntity } from '@reviewpal/be/data';

export type UpdateCountersArgsType = {
  userId: string;
  counters: Partial<
    Pick<
      InteractivePrUserAnalyticsEntity,
      'discussions' | 'inputTokens' | 'outputTokens' | 'publishedComments' | 'reviews' | 'codeSuggestions'
    >
  >;
};
