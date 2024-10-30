import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useMemo } from 'react';
import {
  AppLayout,
  HomePage,
  LoginPage,
  NotFoundPage,
  RootLayout,
  AppRoutes,
  UsersPage,
  ResetPasswordPage,
  IntegrationsPage,
  ReviewerConfigsPage,
  InteractivePrReviewerPage,
  InteractivePrAnalyticsPage,
} from '@reviewpal/web/ui';

export const Router = () => {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: AppRoutes.root,
          Component: RootLayout,
          children: [
            { index: true, Component: LoginPage },
            { path: AppRoutes.login, Component: LoginPage },
            { path: AppRoutes.resetPassword, Component: ResetPasswordPage },
            {
              path: AppRoutes.app,
              Component: AppLayout,
              children: [
                { index: true, Component: HomePage },
                { path: AppRoutes.home, Component: HomePage },
                { path: AppRoutes.users, Component: UsersPage },
                { path: AppRoutes.integrations, Component: IntegrationsPage },
                { path: AppRoutes.reviewers, Component: ReviewerConfigsPage },
                { path: AppRoutes.interactivePrReviewer, Component: InteractivePrReviewerPage },
                { path: AppRoutes.interactivePrAnalytics, Component: InteractivePrAnalyticsPage },
              ],
            },
          ],
        },
        {
          path: '*',
          Component: NotFoundPage,
        },
      ]),
    []
  );

  return <RouterProvider router={router} />;
};
