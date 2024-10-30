import { createStateSelector, loadReviewerAsync, useStateDispatch, useStateSelector } from '@reviewpal/web/state';
import { Result } from '@vladbasin/ts-result';
import { useEffect } from 'react';

type UseReviewerLoaderOptionsType = {
  id: string;
};

const currentReviewerStateSelector = createStateSelector(
  [({ currentReviewer }) => currentReviewer],
  (currentReviewer) => currentReviewer
);

export const useReviewerLoader = ({ id }: UseReviewerLoaderOptionsType) => {
  const dispatch = useStateDispatch();

  useEffect(() => {
    Result.FromPromise(dispatch(loadReviewerAsync(id))).run();
  }, [id, dispatch]);

  return useStateSelector(currentReviewerStateSelector);
};
