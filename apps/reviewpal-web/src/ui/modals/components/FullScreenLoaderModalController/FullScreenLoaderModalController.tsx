import { CircularProgress } from '@mui/material';
import { Result } from '@vladbasin/ts-result';
import { useCallback } from 'react';
import { FillAreaGrid } from '@reviewpal/web/ui/cross-cutting';
import { FullScreenLoaderPresenterSid } from '@reviewpal/web/_sids';
import { fullScreenLoaderContentStyle, Modal } from '@reviewpal/web/ui';

export const FullScreenLoaderModalController = () => {
  const render = useCallback(() => {
    return {
      handler: Result.Void(),
      content: (
        <FillAreaGrid center sx={fullScreenLoaderContentStyle}>
          <CircularProgress />
        </FillAreaGrid>
      ),
    };
  }, []);

  return <Modal<void, void> Presenter={FullScreenLoaderPresenterSid} onRender={render} wrapContent={false} />;
};
