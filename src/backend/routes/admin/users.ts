import { createRoute } from '@hono/zod-openapi'
import {
  userListResponseSchema,
  listUsersQuerySchema,
  adminDashboardResponseSchema,
} from '@/shared/schemas/apis/users'

export const listDashboardRoute = createRoute({
  method: 'get',
  path: '/admin/dashboard',
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: adminDashboardResponseSchema,
        },
      },
    },
  },
})

export const listUsersRoute = createRoute({
  method: 'get',
  path: '/admin/users',
  request: {
    query: listUsersQuerySchema,
  },
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: userListResponseSchema,
        },
      },
    },
  },
})
