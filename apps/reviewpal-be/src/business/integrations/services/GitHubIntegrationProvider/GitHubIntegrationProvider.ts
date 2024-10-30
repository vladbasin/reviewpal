import { inject, injectable } from 'inversify';
import type { IVcsIntegrationProvider, LoadPrArgsType, PublishPrCommentArgsType } from '@reviewpal/be/business';
import { Result } from '@vladbasin/ts-result';
import type { GitHubIntegrationConfigType, PrFileType, PrType } from '@reviewpal/common/integrations';
import { GitHubIntegrationProviderName, integrationProvidersRegistry } from '@reviewpal/common/integrations';
import { Octokit } from '@octokit/rest';
import { HttpStatusCode } from 'axios';
import { CrypterSid } from '@reviewpal/be/_sids';
import type { ICrypter } from '@reviewpal/be/cross-cutting';
import type { IntegrationEntity } from '@reviewpal/be/data';

const UrlChunksSplitter = '/';

@injectable()
export class GitHubIntegrationProvider implements IVcsIntegrationProvider {
  public constructor(@inject(CrypterSid) private readonly _crypter: ICrypter) {}

  public get name(): string {
    return GitHubIntegrationProviderName;
  }

  public loadPrAsync({ integration, url }: LoadPrArgsType): Result<PrType> {
    const { token } = this.getConfig(integration);

    const { owner, repo, pullNumber } = this.parsePrUrl(url);

    const octokit = new Octokit({ auth: token });

    return Result.FromPromise(
      octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
      })
    )
      .ensure((response) => response.status === HttpStatusCode.Ok, 'Failed to load data')
      .onSuccess((response) => response.data as PrFileType[])
      .onSuccess((files) => files.map((file) => this.formatPullRequestFilePatch(file)))
      .onSuccess((files) =>
        Result.FromPromise(octokit.pulls.listCommits({ owner, repo, pull_number: pullNumber })).onSuccess(
          (response) => {
            if (response.status !== HttpStatusCode.Ok) {
              return Result.Fail(`Failed to load PR commits: ${JSON.stringify(response)}`);
            }

            return { files, latestCommitHash: response.data[response.data.length - 1].sha };
          }
        )
      );
  }

  public publishPrCommentAsync({
    integration,
    url,
    content,
    line,
    sha,
    filename,
    side,
  }: PublishPrCommentArgsType): Result<void> {
    const { token } = this.getConfig(integration);

    const { owner, repo, pullNumber } = this.parsePrUrl(url);

    const octokit = new Octokit({ auth: token });

    return Result.FromPromise(
      octokit.pulls.createReviewComment({
        owner,
        repo,
        pull_number: pullNumber,
        body: content,
        line,
        path: filename,
        commit_id: sha,
        side,
      })
    ).ensure((response) => response.status === HttpStatusCode.Created, 'Failed to publish PR comment').void;
  }

  private getConfig(integration: IntegrationEntity): GitHubIntegrationConfigType {
    return this._crypter.secureObject(
      'decrypt',
      integration.config,
      integrationProvidersRegistry.get(this.name)?.securedFields
    ) as GitHubIntegrationConfigType;
  }

  private parsePrUrl(url: string): { owner: string; repo: string; pullNumber: number } {
    const [, , , owner, repo, , pullNumber] = url.split(UrlChunksSplitter);
    return { owner, repo, pullNumber: parseInt(pullNumber, 10) };
  }

  private formatPullRequestFilePatch(file: PrFileType): PrFileType {
    const { filename, status, sha, patch } = file;

    let diff = '';
    diff += `diff --git a/${filename} b/${filename}\n`;

    if (status === 'added') {
      diff += `new file mode 100644\n`;
      diff += `index 0000000..${sha}\n`;
      diff += `--- /dev/null\n`;
      diff += `+++ b/${filename}\n`;
    } else if (status === 'removed') {
      diff += `deleted file mode 100644\n`;
      diff += `index ${sha}..0000000\n`;
      diff += `--- a/${filename}\n`;
      diff += `+++ /dev/null\n`;
    } else if (status === 'modified') {
      diff += `index ${sha}\n`;
      diff += `--- a/${filename}\n`;
      diff += `+++ b/${filename}\n`;
    }

    return { ...file, patch: diff + (patch ? `${patch}\n` : '') };
  }
}
