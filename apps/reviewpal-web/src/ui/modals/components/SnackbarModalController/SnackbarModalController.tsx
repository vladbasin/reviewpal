import { Alert, Slide, Snackbar } from '@mui/material';
import { useCallback } from 'react';
import { Modal, type SnackbarOptionsType } from '@reviewpal/web/ui';
import { ResultSource } from '@reviewpal/common/cross-cutting';
import { SnackbarPresenterSid } from '@reviewpal/web/_sids';

export const SnackbarModalController = () => {
  const render = useCallback((options?: SnackbarOptionsType) => {
    if (!options) {
      throw new Error('Cannot render SnackbarOptionsType without options');
    }

    const resultSource = new ResultSource<void>();

    return {
      handler: resultSource.getResult(),
      content: (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open
          onClose={() => resultSource.resolve()}
          TransitionComponent={Slide}
        >
          <Alert variant="filled" severity={options.severity}>
            {options.message}
          </Alert>
        </Snackbar>
      ),
    };
  }, []);

  return <Modal<SnackbarOptionsType, void> Presenter={SnackbarPresenterSid} onRender={render} mode="empty" />;
};
