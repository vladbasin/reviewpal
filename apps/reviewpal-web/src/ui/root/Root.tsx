import { CssBaseline, ThemeProvider } from '@mui/material';
import { state } from '@reviewpal/web/state';
import { AllModalControllers, Initializer, Router, theme } from '@reviewpal/web/ui';
import { Provider } from 'react-redux';

export const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AllModalControllers />
      <Provider store={state}>
        <Initializer>
          <Router />
        </Initializer>
      </Provider>
    </ThemeProvider>
  );
};
