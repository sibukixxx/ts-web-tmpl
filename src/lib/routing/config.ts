import { RouteConfig } from './types'
import { authGuard, adminGuard } from './guards'

export const defaultRouteConfig: RouteConfig = {
  public: {
    home: {
      title: 'ホーム',
      breadcrumb: 'ホーム',
    },
    about: {
      title: '概要',
      breadcrumb: '概要',
    },
    login: {
      title: 'ログイン',
      breadcrumb: 'ログイン',
    },
    register: {
      title: '新規登録',
      breadcrumb: '新規登録',
    },
  },
  user: {
    profile: {
      title: 'プロフィール',
      breadcrumb: 'プロフィール',
      guards: [authGuard],
    },
    settings: {
      title: '設定',
      breadcrumb: '設定',
      guards: [authGuard],
    },
    dashboard: {
      title: 'ダッシュボード',
      breadcrumb: 'ダッシュボード',
      guards: [authGuard],
    },
  },
  admin: {
    users: {
      title: 'ユーザー管理',
      breadcrumb: 'ユーザー管理',
      guards: [adminGuard],
    },
    settings: {
      title: '管理設定',
      breadcrumb: '管理設定',
      guards: [adminGuard],
    },
    analytics: {
      title: '分析',
      breadcrumb: '分析',
      guards: [adminGuard],
    },
  },
  dynamic: {
    public: {
      post: {
        title: '投稿詳細',
        breadcrumb: '投稿',
      },
    },
    user: {
      ownPost: {
        title: 'マイ投稿',
        breadcrumb: 'マイ投稿',
        guards: [authGuard],
      },
      comment: {
        title: 'コメント',
        breadcrumb: 'コメント',
        guards: [authGuard],
      },
    },
    admin: {
      userManagement: {
        title: 'ユーザー詳細',
        breadcrumb: 'ユーザー',
        guards: [adminGuard],
      },
      userPosts: {
        title: 'ユーザー投稿',
        breadcrumb: '投稿一覧',
        guards: [adminGuard],
      },
    },
  },
}
