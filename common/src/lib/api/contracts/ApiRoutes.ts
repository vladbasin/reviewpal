export const ApiRoutes = {
  health: '/api/health',
  auth: {
    session: '/api/auth/session',
    resetPassword: '/api/auth/resetPassword/:token',
  },
  admin: {
    users: {
      many: '/api/admin/users',
      one: '/api/admin/users/:id',
      requestPasswordReset: '/api/admin/users/:id/requestPasswordReset',
    },
    integrations: {
      many: '/api/admin/integrations',
      one: '/api/admin/integrations/:id',
    },
    reviewerConfigs: {
      many: '/api/admin/reviewerConfigs',
      one: '/api/admin/reviewerConfigs/:id',
    },
    interactivePrAnalytics: {
      many: '/api/admin/interactivePrAnalytics',
      summary: '/api/admin/interactivePrAnalytics/summary',
    },
  },
  reviewers: {
    many: '/api/reviewers',
    one: '/api/reviewers/:id',
  },
  interactivePrReviewers: {
    review: '/api/interactivePrReviewers/:id/review',
    discuss: '/api/interactivePrReviewers/:id/discuss',
    comment: '/api/interactivePrReviewers/:id/comment',
  },
};
