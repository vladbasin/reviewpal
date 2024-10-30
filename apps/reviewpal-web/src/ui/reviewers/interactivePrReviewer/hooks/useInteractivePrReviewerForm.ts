import { InteractivePrReviewArgsTypeSchema, type InteractivePrReviewArgsType } from '@reviewpal/common/reviewers';
import {
  convertUnwrappedToResult,
  createStateSelector,
  reviewPrInteractivelyAsync,
  useStateDispatch,
  useStateSelector,
} from '@reviewpal/web/state';
import { createOnSubmitHandler, useFullScreenLoaderPresenter } from '@reviewpal/web/ui';
import { useFormik } from 'formik';
import { useMemo } from 'react';

type UseInteractivePrReviewerFormOptionsType = {
  reviewerId: string;
  formRef: React.RefObject<HTMLFormElement>;
  onSuccess?: () => void;
};

const currentArgsSelector = createStateSelector(
  [
    ({ interactivePrReviewer }) => interactivePrReviewer.url,
    ({ interactivePrReviewer }) => interactivePrReviewer.userInstructions,
  ],
  (url, userInstructions) => ({ url, userInstructions })
);

export const useInteractivePrReviewerForm = ({
  formRef,
  reviewerId,
  onSuccess,
}: UseInteractivePrReviewerFormOptionsType) => {
  const fullScreenLoaderPresenter = useFullScreenLoaderPresenter();

  const dispatch = useStateDispatch();

  const { url, userInstructions } = useStateSelector(currentArgsSelector);

  const formik = useFormik<InteractivePrReviewArgsType>({
    initialValues: {
      reviewerId,
      url: url ?? '',
      userInstructions: userInstructions ?? '',
    },
    validationSchema: InteractivePrReviewArgsTypeSchema,
    onSubmit: createOnSubmitHandler(
      (values) =>
        convertUnwrappedToResult(dispatch(reviewPrInteractivelyAsync(values)).unwrap()).onSuccess(() => onSuccess?.())
          .void,
      fullScreenLoaderPresenter,
      formRef
    ),
  });

  return useMemo(() => ({ formik }), [formik]);
};
