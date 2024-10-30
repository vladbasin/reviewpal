import type { InteractivePrReviewArgsType, InteractivePrReviewResultType } from '@reviewpal/common/reviewers';
import type { ChangeData } from 'react-diff-view';
import { getChangeKey, isInsert, isNormal, parseDiff } from 'react-diff-view';
import type { WritableDraft } from 'immer';
import { produce } from 'immer';
import { v4 } from 'uuid';
import { isNil } from 'lodash';
import type { PrCommentType, PrFileWithDiffType } from '@reviewpal/web/cross-cutting';
import type { Maybe } from '@vladbasin/ts-types';
import type {
  AddPrCommentArgsType,
  DiscussPrInteractivelyResultType,
  InitiateNextDiscussionTurnType,
  MovePrCommentArgsType,
  UpdatePrCommentArgsType,
} from '@reviewpal/web/state';
import type { PrCommentSideType, PromptLlmMessageType } from '@reviewpal/common/integrations';

export type InteractivePrReviewerStateType = {
  url?: string;
  userInstructions?: string;
  reviewResult?: InteractivePrReviewResultType;
  files: {
    all: string[];
    byFilename: Record<string, Maybe<PrFileWithDiffType>>;
  };
  comments: {
    all: string[];
    byFilename: Record<string, Maybe<string[]>>;
    byId: Record<string, Maybe<PrCommentType>>;
  };
  discussions: {
    byCommentId: Record<string, Maybe<PromptLlmMessageType[]>>;
  };
};

export class InteractivePrReviewerState {
  public constructor(state: InteractivePrReviewerStateType) {
    this._state = state;
  }

  public static createInitialState(): InteractivePrReviewerStateType {
    return {
      files: { all: [], byFilename: {} },
      comments: { all: [], byFilename: {}, byId: {} },
      discussions: { byCommentId: {} },
    };
  }

  public addComment({
    filename,
    change,
    changeIndex,
    hunkIndex,
  }: AddPrCommentArgsType): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      const newComment: PrCommentType = {
        id: v4(),
        changeKey: getChangeKey(change),
        changeIndex: changeIndex,
        hunkIndex: hunkIndex,
        filename: filename,
        line: this.getChangeLineNumber(change),
        content: '',
        isLineRelated: true,
        isPublished: false,
        side: this.getCommentSide(change),
      };

      this.addCommentToDraft(draft, newComment);
    });
  }

  public updateComment({ id, content }: UpdatePrCommentArgsType): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      const targetComment = draft.comments.byId[id];

      if (!targetComment) {
        console.warn('Comment not found', id);
        return;
      }

      targetComment.content = content;
    });
  }

  public deleteComment(id: string): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      const targetComment = draft.comments.byId[id];

      if (!targetComment) {
        console.warn('Comment not found', id);
        return;
      }

      draft.comments.all = draft.comments.all.filter((commentId) => commentId !== id);
      draft.comments.byFilename[targetComment.filename] =
        draft.comments.byFilename[targetComment.filename]?.filter((commentId) => commentId !== id) ?? [];
      delete draft.comments.byId[id];
      delete draft.discussions.byCommentId[id];
    });
  }

  public moveComment({ id, direction }: MovePrCommentArgsType): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      const targetComment = draft.comments.byId[id];

      if (!targetComment) {
        console.warn('Comment not found', id);
        return;
      }

      const file = draft.files.byFilename[targetComment.filename];

      if (!file) {
        console.warn('File not found', targetComment.filename);
        return;
      }

      let targetChangeIndex = targetComment.changeIndex + (direction === 'up' ? -1 : 1);
      let targetHunkIndex = targetComment.hunkIndex;
      if (targetChangeIndex < 0) {
        targetHunkIndex -= 1;
        if (targetHunkIndex < 0) {
          return;
        }
        targetChangeIndex = file.diff.hunks[targetHunkIndex].changes.length - 1;
      }
      if (targetChangeIndex >= file.diff.hunks[targetHunkIndex].changes.length) {
        targetHunkIndex += 1;
        if (targetHunkIndex >= file.diff.hunks.length) {
          return;
        }
        targetChangeIndex = 0;
      }
      if (targetChangeIndex >= 0 && targetChangeIndex < file.diff.hunks[targetHunkIndex].changes.length) {
        targetComment.hunkIndex = targetHunkIndex;
        targetComment.changeIndex = targetChangeIndex;
        targetComment.changeKey = getChangeKey(file.diff.hunks[targetHunkIndex].changes[targetChangeIndex]);
      }
    });
  }

  public markCommentAsPublished(commentId: string): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      const targetComment = draft.comments.byId[commentId];

      if (!targetComment) {
        console.warn('Comment not found', commentId);
        return;
      }

      targetComment.isPublished = true;
    });
  }

  public startOverDiscussion(commentId: string): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      delete draft.discussions.byCommentId[commentId];
    });
  }

  public initiateNextDiscussionTurn({
    commentId,
    userMessage,
  }: InitiateNextDiscussionTurnType): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      const { byCommentId } = draft.discussions;

      byCommentId[commentId] = [...(byCommentId[commentId] ?? []), { role: 'user', content: userMessage }];
    });
  }

  public applyDiscussionResult({
    messages,
    commentId,
  }: DiscussPrInteractivelyResultType): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      draft.discussions.byCommentId[commentId] = messages;
    });
  }

  public applyReviewResult(
    result: InteractivePrReviewResultType,
    { url, userInstructions }: InteractivePrReviewArgsType
  ): InteractivePrReviewerStateType {
    return produce(this._state, (draft) => {
      const allFiles = result.pullRequest.files.flatMap((file) => ({ pr: file, diff: parseDiff(file.patch)[0] }));

      draft.url = url;
      draft.userInstructions = userInstructions;
      draft.reviewResult = result;
      draft.files = {
        all: allFiles.map((file) => file.pr.filename),
        byFilename: allFiles.reduce<Record<string, PrFileWithDiffType>>((map, file) => {
          map[file.pr.filename] = file;
          return map;
        }, {}),
      };

      result.suggestions?.forEach((suggestion) => {
        const file = draft.files.byFilename[suggestion.filename];

        if (!file) {
          console.warn('File not found for suggestion', suggestion);
          return;
        }

        let targetChange: Maybe<ChangeData>;
        let hunkIndex: Maybe<number>;
        let changeIndex: Maybe<number>;

        for (let h = 0; h < file.diff.hunks.length; h++) {
          for (let c = 0; c < file.diff.hunks[h].changes.length; c++) {
            const change = file.diff.hunks[h].changes[c];
            if (change.content.includes(suggestion.lineIdSubstring)) {
              targetChange = change;
              hunkIndex = h;
              changeIndex = c;
              break;
            }
          }

          if (targetChange) {
            break;
          }

          for (let c = 0; c < file.diff.hunks[h].changes.length; c++) {
            const change = file.diff.hunks[h].changes[c];
            if (this.getChangeLineNumber(change) === suggestion.lineNumber) {
              targetChange = change;
              hunkIndex = h;
              changeIndex = c;
              break;
            }
          }
        }

        if (!targetChange) {
          console.warn('Change not found for suggestion', suggestion);
        }

        targetChange = targetChange ?? file.diff.hunks[0].changes[0];

        const newComment: PrCommentType = {
          id: v4(),
          changeKey: getChangeKey(targetChange),
          hunkIndex: hunkIndex ?? 0,
          changeIndex: changeIndex ?? 0,
          filename: file.pr.filename,
          line: this.getChangeLineNumber(targetChange),
          content: suggestion.suggestion,
          isLineRelated: !isNil(targetChange),
          isPublished: false,
          side: this.getCommentSide(targetChange),
        };

        this.addCommentToDraft(draft, newComment);
      });
    });
  }

  private _state: InteractivePrReviewerStateType;

  private addCommentToDraft(draft: WritableDraft<InteractivePrReviewerStateType>, comment: PrCommentType): void {
    const { comments } = draft;

    comments.all.push(comment.id);

    const byFilename = comments.byFilename[comment.filename] ?? [];
    comments.byFilename[comment.filename] = [...byFilename, comment.id];
    comments.byId[comment.id] = comment;
  }

  private getChangeLineNumber(change: ChangeData): number {
    return isNormal(change) ? change.oldLineNumber : change.lineNumber;
  }

  private getCommentSide(change: ChangeData): PrCommentSideType {
    return isInsert(change) ? 'RIGHT' : 'LEFT';
  }
}
