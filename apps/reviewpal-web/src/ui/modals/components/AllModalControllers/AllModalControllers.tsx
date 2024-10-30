import { ConfirmModalController, FullScreenLoaderModalController, SnackbarModalController } from '@reviewpal/web/ui';

export const AllModalControllers = () => {
  return (
    <>
      <FullScreenLoaderModalController />
      <ConfirmModalController />
      <SnackbarModalController />
    </>
  );
};
