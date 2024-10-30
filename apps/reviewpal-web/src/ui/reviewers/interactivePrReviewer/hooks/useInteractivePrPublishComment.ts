import {
  convertUnwrappedToResult,
  createStateSelector,
  publishPrCommentAsync,
  useStateDispatch,
  useStateSelector,
} from '@reviewpal/web/state';
import { useCallback } from 'react';
import { useCurrentReviewer, useExecuteWithLoader, useInteractivePrUrl } from '@reviewpal/web/ui';

const filesSelector = createStateSelector(
  [({ interactivePrReviewer }) => interactivePrReviewer.files],
  (state) => state
);
const commentByIdSelector = createStateSelector(
  [({ interactivePrReviewer }) => interactivePrReviewer.comments.byId],
  (state) => state
);
const reviewResultSelector = createStateSelector(
  [({ interactivePrReviewer }) => interactivePrReviewer.reviewResult],
  (state) => state
);

export const useInteractivePublishPrComment = () => {
  const executeWithLoader = useExecuteWithLoader();
  const dispatch = useStateDispatch();

  const currentReviewer = useCurrentReviewer();
  const currentReviewerId = currentReviewer?.id;

  const files = useStateSelector(filesSelector);
  const commentsById = useStateSelector(commentByIdSelector);
  const url = useInteractivePrUrl();
  const reviewResult = useStateSelector(reviewResultSelector);
  const sha = reviewResult?.pullRequest.latestCommitHash;
  return useCallback(
    (commentId: string) => {
      const comment = commentsById[commentId];
      const file = files.byFilename[comment?.filename ?? ''];

      if (!comment || !file || !currentReviewerId || !url || !sha) {
        console.warn('Required data not found');
        return;
      }

      executeWithLoader({
        executor: () =>
          convertUnwrappedToResult(
            dispatch(
              publishPrCommentAsync({
                commentId,
                reviewerId: currentReviewerId,
                sha,
                url,
                filename: comment.filename,
                content: comment.content,
                line: comment.line,
                side: comment.side,
              })
            ).unwrap()
          ),
        errorBehavior: 'showSnackbar',
      });
    },
    [executeWithLoader, currentReviewerId, url, commentsById, files.byFilename, sha, dispatch]
  );
};
