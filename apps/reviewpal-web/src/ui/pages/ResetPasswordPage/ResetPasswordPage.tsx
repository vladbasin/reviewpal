import { Button, Stack, Typography } from '@mui/material';
import {
  CenterPageContainer,
  Form,
  FormTextField,
  useResetPasswordForm,
  useTitle,
  useTypedParams,
  withAuth,
} from '@reviewpal/web/ui';
import { useRef } from 'react';

export const ResetPasswordPage = withAuth('onlyNotAuthorized', () => {
  useTitle('Reset Password');

  const { token } = useTypedParams('resetPassword');

  const formRef = useRef<HTMLElement>(null);
  const { formik } = useResetPasswordForm({ formRef, token });

  return (
    <CenterPageContainer>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4" align="center">
          Reset password
        </Typography>
        <Form forwardRef={formRef} type="stack" middleScreen formik={formik}>
          <FormTextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            formik={formik}
          />
          <FormTextField
            fullWidth
            name="passwordRepeat"
            label="Password repeat"
            type="password"
            autoComplete="new-password"
            formik={formik}
          />
          <Button fullWidth variant="contained" onClick={() => formik.handleSubmit()}>
            Reset password
          </Button>
        </Form>
      </Stack>
    </CenterPageContainer>
  );
});
