export const ROUTE_PATHS = {
  public: {
    home: '/',
    about: '/about',
    login: '/login',
    register: '/register',
  },
  user: {
    profile: '/user/profile',
    settings: '/user/settings',
    dashboard: '/user/dashboard',
  },
  admin: {
    users: '/admin/users',
    settings: '/admin/settings',
    analytics: '/admin/analytics',
  },
} as const;

export const DYNAMIC_ROUTE_PATTERNS = {
  public: {
    post: '/posts/:postId',
  },
  user: {
    ownPost: '/user/posts/:postId',
    comment: '/user/posts/:postId/comments/:commentId',
  },
  admin: {
    userManagement: '/admin/users/:userId',
    userPosts: '/admin/users/:userId/posts',
  },
} as const;