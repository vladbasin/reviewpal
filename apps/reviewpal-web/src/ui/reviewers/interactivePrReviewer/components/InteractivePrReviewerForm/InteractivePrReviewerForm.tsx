import { Button } from '@mui/material';
import type { InteractivePrReviewArgsType } from '@reviewpal/common/reviewers';
import { Form, FormTextField, useCurrentReviewer, useInteractivePrReviewerForm } from '@reviewpal/web/ui';
import { useRef } from 'react';

type InteractivePrReviewerFormPropsType = {
  onSuccess?: () => void;
};

export const InteractivePrReviewerForm = ({ onSuccess }: InteractivePrReviewerFormPropsType) => {
  const currentReviewer = useCurrentReviewer();

  const formRef = useRef<HTMLFormElement>(null);
  const { formik } = useInteractivePrReviewerForm({ reviewerId: currentReviewer?.id ?? '', formRef, onSuccess });

  return (
    <Form<InteractivePrReviewArgsType> forwardRef={formRef} type="stack" formik={formik} alignItems="flex-start">
      <FormTextField fullWidth name="url" label="URL" type="url" formik={formik} />
      <FormTextField
        fullWidth
        name="userInstructions"
        label="Instructions (optional)"
        multiline
        minRows={5}
        formik={formik}
      />
      <Button variant="contained" onClick={() => formik.handleSubmit()}>
        Next
      </Button>
    </Form>
  );
};
