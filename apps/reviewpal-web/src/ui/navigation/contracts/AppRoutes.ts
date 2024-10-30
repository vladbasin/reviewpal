export enum AppRoutes {
  root = '/',
  login = '/login',
  resetPassword = '/reset-password/:token',
  app = '/app',
  home = '/app/home',
  users = '/app/admin/users',
  integrations = '/app/admin/integrations',
  reviewers = '/app/admin/reviewers',
  interactivePrReviewer = '/app/interactive-pr-reviewers/:id',
  interactivePrAnalytics = '/app/interactive-pr-analytics',
}
