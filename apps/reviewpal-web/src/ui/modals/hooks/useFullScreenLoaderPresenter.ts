import { FullScreenLoaderPresenterSid } from '@reviewpal/web/_sids';
import type { IFullScreenLoaderPresenter } from '@reviewpal/web/ui';
import { useService } from '@reviewpal/web/ui';

export const useFullScreenLoaderPresenter = () => useService<IFullScreenLoaderPresenter>(FullScreenLoaderPresenterSid);
