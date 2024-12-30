import { Middleware, MiddlewareContext } from './types';

export const loggingMiddleware: Middleware = async (context, next) => {
  console.log(`Navigation requested: ${context.path}`, {
    params: context.params,
    query: context.query,
    role: context.role,
    timestamp: new Date().toISOString(),
  });
  return next();
};

export const errorLoggingMiddleware: Middleware = async (context, next) => {
  try {
    return await next();
  } catch (error) {
    console.error('Navigation error:', error);
    throw error;
  }
};