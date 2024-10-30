import { InteractivePrUserAnalyticsRepositorySid } from '@reviewpal/be/_sids';
import type { IInteractivePrReviewerAnalyticsProvider } from '@reviewpal/be/business';
import type { IInteractivePrUserAnalyticsRepository } from '@reviewpal/be/data';
import type { InteractivePrReviewerAnalyticsSummaryType } from '@reviewpal/common/reviewers';
import { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';

@injectable()
export class InteractivePrReviewerAnalyticsProvider implements IInteractivePrReviewerAnalyticsProvider {
  public constructor(
    @inject(InteractivePrUserAnalyticsRepositorySid)
    private readonly _interactivePrUserAnalyticsRepository: IInteractivePrUserAnalyticsRepository
  ) {}

  public provideSummaryAsync(): Result<InteractivePrReviewerAnalyticsSummaryType> {
    const properties: (keyof InteractivePrReviewerAnalyticsSummaryType)[] = [
      'reviews',
      'codeSuggestions',
      'publishedComments',
      'discussions',
      'inputTokens',
      'outputTokens',
    ];

    return Result.CombineFactories(
      properties.map((prop) => () => Result.FromPromise(this._interactivePrUserAnalyticsRepository.sum(prop))),
      { concurrency: 2 }
    ).onSuccess((results): InteractivePrReviewerAnalyticsSummaryType => {
      const [reviews, codeSuggestions, publishedComments, discussions, inputTokens, outputTokens] = results.map(
        (result) => result ?? 0
      );

      return {
        reviews,
        codeSuggestions,
        publishedComments,
        discussions,
        inputTokens,
        outputTokens,
      };
    });
  }
}
