import {
  convertUnwrappedToResult,
  createStateSelector,
  discussPrInteractivelyAsync,
  initiateNextDiscussionTurn,
  useStateDispatch,
  useStateSelector,
} from '@reviewpal/web/state';
import { useCurrentReviewer, useSnackbarPresenter, type ChatMessageType } from '@reviewpal/web/ui';
import { useCallback, useMemo, useState } from 'react';

type UseInteractivePrChatOptionsType = {
  commentId: string;
};

export const useInteractivePrChat = ({ commentId }: UseInteractivePrChatOptionsType) => {
  const currentReviewer = useCurrentReviewer();
  const snackbarPresenter = useSnackbarPresenter();
  const dispatch = useStateDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const messagesSelector = useMemo(
    () =>
      createStateSelector(
        [({ interactivePrReviewer }) => interactivePrReviewer.discussions.byCommentId[commentId ?? '']],
        (promptMessages) =>
          promptMessages?.map(
            (message): ChatMessageType => ({
              role: message.role,
              content: message.content,
            })
          ) ?? []
      ),
    [commentId]
  );
  const messages = useStateSelector(messagesSelector);

  const commentsSelector = useMemo(
    () =>
      createStateSelector(
        [({ interactivePrReviewer }) => interactivePrReviewer.comments.byId[commentId ?? '']],
        (comment) => comment
      ),
    [commentId]
  );
  const comment = useStateSelector(commentsSelector);

  const fileSelector = useMemo(
    () =>
      createStateSelector(
        [({ interactivePrReviewer }) => interactivePrReviewer.files.byFilename[comment?.filename ?? '']],
        (file) => file
      ),
    [comment]
  );
  const file = useStateSelector(fileSelector);

  const onSend = useCallback(
    (userMessage: string) => {
      if (!file) {
        return;
      }

      setIsLoading(true);

      dispatch(initiateNextDiscussionTurn({ commentId: commentId ?? '', userMessage }));

      convertUnwrappedToResult(
        dispatch(
          discussPrInteractivelyAsync({
            reviewerId: currentReviewer?.id ?? '',
            commentId,
            file: file.pr,
            codeSuggestion: comment?.content ?? '',
            messages: messages
              .map((message) => ({
                role: message.role,
                content: message.content ?? '',
              }))
              .concat([{ role: 'user', content: userMessage }]),
          })
        ).unwrap()
      )
        .onFailure((error) => snackbarPresenter.present({ message: error, severity: 'error' }))
        .onBoth(() => setIsLoading(false))
        .run();
    },
    [snackbarPresenter, comment, commentId, file, currentReviewer?.id, messages, dispatch]
  );

  return useMemo(() => ({ messages, isLoading, onSend }), [messages, isLoading, onSend]);
};
