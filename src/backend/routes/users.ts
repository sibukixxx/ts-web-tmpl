import { createRoute } from '@hono/zod-openapi'
import {
  userRegisterRequestSchema,
  userRegisterResponseSchema,
  userListResponseSchema,
} from '@/shared/schemas/apis/users'
import { z } from '@/shared/schemas/zod-setup'

export const registerUserRoute = createRoute({
  method: 'post',
  path: '/users/register',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: userRegisterRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: userRegisterResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
})

export const listUsersRoute = createRoute({
  method: 'get',
  path: '/users',
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
