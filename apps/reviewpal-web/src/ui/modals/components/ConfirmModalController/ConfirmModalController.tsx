import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid2 } from '@mui/material';
import { ResultSource } from '@reviewpal/common/cross-cutting';
import { ConfirmPresenterSid } from '@reviewpal/web/_sids';
import { Modal, type ConfirmOptionsType } from '@reviewpal/web/ui';
import { useCallback } from 'react';

export const ConfirmModalController = () => {
  const render = useCallback((options?: ConfirmOptionsType) => {
    if (!options) {
      throw new Error('Cannot render ConfirmModalController without options');
    }

    const resultSource = new ResultSource<boolean>();

    return {
      handler: resultSource.getResult(),
      content: (
        <>
          <DialogTitle>
            <Grid2 container spacing={1}>
              <Grid2>{options.title}</Grid2>
            </Grid2>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{options.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => resultSource.resolve(false)}>
              {options.reject}
            </Button>
            <Button variant="contained" onClick={() => resultSource.resolve(true)}>
              {options.confirm}
            </Button>
          </DialogActions>
        </>
      ),
    };
  }, []);

  return <Modal<ConfirmOptionsType, boolean> Presenter={ConfirmPresenterSid} onRender={render} />;
};
