import { inject, injectable } from 'inversify';
import type { CrudControllerOperationType } from '@reviewpal/be/api';
import { CrudControllerBase, type IController } from '@reviewpal/be/api';
import { ApiRoutes } from '@reviewpal/common/api';
import { ReviewerConfigsRepositorySid, TokenAuthorizerSid } from '@reviewpal/be/_sids';
import type { ITokenAuthorizer } from '@reviewpal/be/business';
import type { IReviewerConfigsRepository, ReviewerConfigEntity, IRepositoryBase } from '@reviewpal/be/data';
import type { ReviewerConfigApiType } from '@reviewpal/common/reviewerConfigs';
import { Result } from '@vladbasin/ts-result';

@injectable()
export class ReviewerConfigsController
  extends CrudControllerBase<ReviewerConfigEntity, ReviewerConfigApiType>
  implements IController
{
  public constructor(
    @inject(ReviewerConfigsRepositorySid) private readonly _reviewerConfigsRepository: IReviewerConfigsRepository,
    @inject(TokenAuthorizerSid) protected readonly _tokenAuthorizer: ITokenAuthorizer
  ) {
    super(_tokenAuthorizer);
  }

  protected get repository(): IRepositoryBase<ReviewerConfigEntity> {
    return this._reviewerConfigsRepository;
  }

  protected getOperation: CrudControllerOperationType = {
    auth: ['user', 'admin'],
    route: ApiRoutes.reviewers.one,
  };
  protected listOperation: CrudControllerOperationType = {
    auth: ['user', 'admin'],
    route: ApiRoutes.reviewers.many,
  };
  protected createOperation = undefined;
  protected updateOperation = undefined;
  protected deleteOperation = undefined;

  protected mapEntityToApiItemAsync({ id, name, reviewer }: ReviewerConfigEntity): Result<ReviewerConfigApiType> {
    return Result.Ok({
      id,
      name,
      reviewer,
    });
  }
}
