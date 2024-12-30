import { RouteGuard, MiddlewareContext } from './types';

export const authGuard: RouteGuard = {
  canActivate: async (context: MiddlewareContext) => {
    return context.role !== 'guest';
  },
  canDeactivate: async () => true,
};

export const adminGuard: RouteGuard = {
  canActivate: async (context: MiddlewareContext) => {
    return context.role === 'admin';
  },
  canDeactivate: async () => true,
};