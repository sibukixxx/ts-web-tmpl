import { ValidationRules } from './types';

export const defaultValidationRules: Record<string, ValidationRules> = {
  '/users/:userId': {
    userId: {
      pattern: /^[0-9a-f]{24}$/,
      errorMessage: '無効なユーザーIDです',
    },
  },
  '/posts/:postId': {
    postId: {
      pattern: /^[0-9a-f]{24}$/,
      errorMessage: '無効な投稿IDです',
    },
  },
};
