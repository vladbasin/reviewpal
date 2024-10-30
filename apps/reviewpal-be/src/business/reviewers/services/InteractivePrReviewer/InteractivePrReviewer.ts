import {
  IntegrationsResolverSid,
  InteractivePrUserAnalyticsRepositorySid,
  ReviewerConfigsRepositorySid,
} from '@reviewpal/be/_sids';
import type {
  InteractivePrCommentTemplatePlaceholdersType,
  InteractivePrFileChangesTemplatePlaceholdersType,
} from '@reviewpal/be/business';
import {
  InteractivePrCommentTemplate,
  InteractivePrFileChangesTemplate,
  InteractivePrReviewerJsonFuncDescription,
  InteractivePrReviewerJsonFuncSchema,
  InteractivePrReviewerJsonFuncTypeSchema,
  type IIntegrationsResolver,
  type IInteractivePrReviewer,
  type ILlmIntegrationProvider,
  type IVcsIntegrationProvider,
} from '@reviewpal/be/business';
import { CodedError, NotFoundError, UnknownError } from '@reviewpal/common/cross-cutting';
import type { IntegrationType, PrFileType, PromptLlmMessageType, PrType } from '@reviewpal/common/integrations';
import { Result } from '@vladbasin/ts-result';
import { inject, injectable } from 'inversify';
import type {
  InteractivePrDiscussArgsType,
  InteractivePrDiscussResultType,
  InteractivePrPublishCommentArgsType,
  InteractivePrReviewArgsType,
  InteractivePrReviewerDefaultSystemPromptPlaceholdersType,
  InteractivePrReviewerDiscussSystemPromptPlaceholdersType,
  InteractivePrReviewResultType,
} from '@reviewpal/common/reviewers';
import {
  InteractivePrDiscussArgsTypeSchema,
  InteractivePrPublishCommentArgsTypeSchema,
  InteractivePrReviewArgsTypeSchema,
  InteractivePrReviewerDiscussSystemPrompt,
  InteractivePrReviewerJsonFuncName,
} from '@reviewpal/common/reviewers';
import type {
  IInteractivePrUserAnalyticsRepository,
  IntegrationEntity,
  IReviewerConfigsRepository,
  ReviewerConfigEntity,
} from '@reviewpal/be/data';
import type { InteractivePrReviewerConfigType } from '@reviewpal/common/reviewerConfigs';
import { chunk, isNil } from 'lodash';
import type { WithUser, WithUserId } from '@reviewpal/be/cross-cutting';
import { compile } from 'handlebars';

const LlmConcurrency = 3;

@injectable()
export class InteractivePrReviewer implements IInteractivePrReviewer {
  public constructor(
    @inject(ReviewerConfigsRepositorySid)
    private readonly _reviewerConfigsRepository: IReviewerConfigsRepository,
    @inject(IntegrationsResolverSid)
    private readonly _integrationsResolver: IIntegrationsResolver,
    @inject(InteractivePrUserAnalyticsRepositorySid)
    private readonly _interactivePrUserAnalyticsRepository: IInteractivePrUserAnalyticsRepository
  ) {
    this._compiledSystemPromptForDiscussion = compile<InteractivePrReviewerDiscussSystemPromptPlaceholdersType>(
      InteractivePrReviewerDiscussSystemPrompt
    );
    this._compiledCommentTemplate = compile<InteractivePrCommentTemplatePlaceholdersType>(InteractivePrCommentTemplate);
    this._compiledFileChangesTemplate = compile<InteractivePrFileChangesTemplatePlaceholdersType>(
      InteractivePrFileChangesTemplate
    );
  }

  public reviewAsync(args: WithUserId<InteractivePrReviewArgsType>): Result<InteractivePrReviewResultType> {
    const { reviewerId, url, userInstructions, userId } = args;

    return Result.Ok(args)
      .onSuccess(() => InteractivePrReviewArgsTypeSchema.validate(args))
      .onSuccess(() =>
        this._reviewerConfigsRepository.findOne({
          where: { id: reviewerId },
          relations: { integrationsInReviewerConfigs: { integration: true } },
        })
      )
      .ensureUnwrap((reviewerConfig) => reviewerConfig, NotFoundError)
      .onSuccess((reviewerConfig) => this.createReviewContextAsync(reviewerConfig))
      .onSuccess(({ vcsIntegration, llmIntegration, vcsIntegrationProvider, llmIntegrationProvider, config }) =>
        vcsIntegrationProvider.loadPrAsync({ integration: vcsIntegration, url }).onSuccess((pullRequest) =>
          Result.CombineFactories(
            chunk(pullRequest.files, config.filesPerPrompt).map(
              (files) => () =>
                llmIntegrationProvider.promptAsJsonAsync({
                  integration: llmIntegration,
                  systemPrompt: this.buildSystemPromptForReview(config, pullRequest, userInstructions),
                  messages: this.buildMessages(files),
                  jsonFunction: {
                    name: InteractivePrReviewerJsonFuncName,
                    description: InteractivePrReviewerJsonFuncDescription,
                    jsonSchema: InteractivePrReviewerJsonFuncSchema,
                    validationSchema: InteractivePrReviewerJsonFuncTypeSchema,
                  },
                })
            ),
            { concurrency: LlmConcurrency }
          )
            .onSuccessExecute((results) =>
              this._interactivePrUserAnalyticsRepository.updateCountersAsync({
                userId,
                counters: {
                  reviews: 1,
                  inputTokens: results.reduce((acc, current) => acc + current.inputTokens, 0),
                  outputTokens: results.reduce((acc, current) => acc + current.outputTokens, 0),
                  codeSuggestions: results.reduce((acc, current) => acc + current.json.codeSuggestions.length, 0),
                },
              })
            )
            .onSuccess(
              (results): InteractivePrReviewResultType => ({
                pullRequest,
                suggestions: results.flatMap((t) => t.json.codeSuggestions),
              })
            )
        )
      );
  }

  public discussAsync(args: WithUserId<InteractivePrDiscussArgsType>): Result<InteractivePrDiscussResultType> {
    const { reviewerId, file, codeSuggestion, messages, userId } = args;

    return Result.Ok(args)
      .onSuccess(() => InteractivePrDiscussArgsTypeSchema.validate(args))
      .onSuccess(() => this.lookupReviewer(reviewerId))
      .onSuccess((reviewer) => this.createReviewContextAsync(reviewer))
      .onSuccess(({ llmIntegrationProvider, llmIntegration }) =>
        llmIntegrationProvider.promptAsChatAsync({
          integration: llmIntegration,
          systemPrompt: this.buildSystemPromptForDiscussion(file, codeSuggestion),
          messages,
        })
      )
      .onSuccessExecute(({ inputTokens, outputTokens }) =>
        this._interactivePrUserAnalyticsRepository.updateCountersAsync({
          userId,
          counters: {
            discussions: 1,
            inputTokens,
            outputTokens,
          },
        })
      )
      .onSuccess(({ assistantMessage }) => ({
        messages: [...messages, { role: 'assistant', content: assistantMessage }],
      }));
  }

  public publishCommentAsync(args: WithUser<InteractivePrPublishCommentArgsType>): Result<void> {
    const { reviewerId, url, filename, content, line, sha, side, userId, userName } = args;

    return Result.Ok(args)
      .onSuccess(() => InteractivePrPublishCommentArgsTypeSchema.validate(args))
      .onSuccess(() => this.lookupReviewer(reviewerId))
      .onSuccess((reviewer) => this.createReviewContextAsync(reviewer))
      .onSuccess(({ vcsIntegrationProvider, vcsIntegration, config }) =>
        vcsIntegrationProvider.publishPrCommentAsync({
          integration: vcsIntegration,
          url,
          filename,
          content: this.getCommentContent(content, config.isWatermarkEnabled, userName),
          line,
          sha,
          side,
        })
      )
      .onSuccessExecute(() =>
        this._interactivePrUserAnalyticsRepository.updateCountersAsync({
          userId,
          counters: {
            publishedComments: 1,
          },
        })
      );
  }

  private _compiledSystemPromptForDiscussion: HandlebarsTemplateDelegate<InteractivePrReviewerDiscussSystemPromptPlaceholdersType>;
  private _compiledCommentTemplate: HandlebarsTemplateDelegate<InteractivePrCommentTemplatePlaceholdersType>;
  private _compiledFileChangesTemplate: HandlebarsTemplateDelegate<InteractivePrFileChangesTemplatePlaceholdersType>;

  private getCommentContent(content: string, isWatermarkEnabled: boolean, reviewerName: string): string {
    if (!isWatermarkEnabled) {
      return content;
    }

    return this._compiledCommentTemplate({
      onBehalfOf: reviewerName,
      content: content,
    });
  }

  private buildMessages(files: PrFileType[]): PromptLlmMessageType[] {
    const content = files.map((file) => this.createFileChangesMessageContent(file)).join('\n\n');

    return [{ role: 'user', content }];
  }

  private createFileChangesMessageContent(file: PrFileType): string {
    return this._compiledFileChangesTemplate({
      filename: file.filename,
      status: file.status,
      patch: file.patch,
    });
  }

  private buildSystemPromptForReview(
    { systemPrompt, desiredCommentsCountPer100Changes }: InteractivePrReviewerConfigType,
    pullRequest: PrType,
    userInstructions?: string
  ): string {
    const totalChangesCount = pullRequest.files.reduce((acc, file) => acc + file.changes, 0);
    const desiredCommentsCount = Math.max(1, Math.round((totalChangesCount / 100) * desiredCommentsCountPer100Changes));

    const compiledSystemPrompt = compile<InteractivePrReviewerDefaultSystemPromptPlaceholdersType>(systemPrompt);

    return compiledSystemPrompt({
      suggestionsCount: desiredCommentsCount,
      hasUserInstructions: !isNil(userInstructions) && userInstructions.length > 0,
      userInstructions,
    });
  }

  private buildSystemPromptForDiscussion(file: PrFileType, codeSuggestion: string): string {
    return this._compiledSystemPromptForDiscussion({
      fileChanges: this.createFileChangesMessageContent(file),
      codeSuggestion,
    });
  }

  private lookupReviewer(reviewerId: string): Result<ReviewerConfigEntity> {
    return Result.FromPromise(
      this._reviewerConfigsRepository.findOne({
        where: { id: reviewerId },
        relations: { integrationsInReviewerConfigs: { integration: true } },
      })
    ).ensureUnwrap((reviewerConfig) => reviewerConfig, NotFoundError);
  }

  private createReviewContextAsync(reviewer: ReviewerConfigEntity): Result<{
    vcsIntegrationProvider: IVcsIntegrationProvider;
    llmIntegrationProvider: ILlmIntegrationProvider;
    vcsIntegration: IntegrationType;
    llmIntegration: IntegrationType;
    config: InteractivePrReviewerConfigType;
  }> {
    const { integrationsInReviewerConfigs } = reviewer;
    const integrations =
      integrationsInReviewerConfigs?.map((t) => t.integration).filter<IntegrationEntity>((t) => !isNil(t)) ?? [];

    if (!integrations) {
      // This is a bug in the system, as the data should be present
      return Result.FailWithError(
        new CodedError({ code: UnknownError, message: 'Reviewer does not have integrations' })
      );
    }

    const vcsIntegration = integrations.find((i) => i.source === 'vcs');
    const llmIntegration = integrations.find((i) => i.source === 'llm');

    if (!vcsIntegration || !llmIntegration) {
      // This is a bug in the system, as the data should be present
      return Result.FailWithError(
        new CodedError({ code: UnknownError, message: 'Reviewer does not have correct reference to providers' })
      );
    }

    const vcsIntegrationProvider = this._integrationsResolver.resolve<IVcsIntegrationProvider>(vcsIntegration.provider);
    const llmIntegrationProvider = this._integrationsResolver.resolve<ILlmIntegrationProvider>(llmIntegration.provider);

    if (!vcsIntegrationProvider || !llmIntegrationProvider) {
      // This is a bug in the system, as the data should be present
      return Result.FailWithError(new CodedError({ code: UnknownError, message: 'Providers are not implemented' }));
    }

    return Result.Ok({
      vcsIntegrationProvider,
      llmIntegrationProvider,
      vcsIntegration,
      llmIntegration,
      config: reviewer.config as InteractivePrReviewerConfigType,
    });
  }
}
