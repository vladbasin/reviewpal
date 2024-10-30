import { Button, InputAdornment, Stack, Typography } from '@mui/material';
import { CenterPageContainer, Form, FormTextField, useLoginForm, useTitle, withAuth } from '@reviewpal/web/ui';
import { useRef } from 'react';
import { Lock, Person } from '@mui/icons-material';

export const LoginPage = withAuth('onlyNotAuthorized', () => {
  useTitle('Login');

  const formRef = useRef<HTMLElement>(null);
  const { formik } = useLoginForm(formRef);

  return (
    <CenterPageContainer>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4" align="center">
          Welcome
        </Typography>
        <Form forwardRef={formRef} type="stack" middleScreen formik={formik}>
          <FormTextField
            fullWidth
            autoComplete="email"
            name="email"
            label="Email"
            formik={formik}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Person />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormTextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            formik={formik}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Lock />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button fullWidth variant="contained" onClick={() => formik.handleSubmit()}>
            Login
          </Button>
        </Form>
      </Stack>
    </CenterPageContainer>
  );
});
