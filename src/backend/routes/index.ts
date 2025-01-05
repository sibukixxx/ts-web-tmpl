import { createRoute } from '@hono/zod-openapi'
import {
  loginRequestSchema,
  loginResponseSchema,
  userListResponseSchema,
} from '@/shared/schemas/apis/auth-schemas'
import { z } from 'zod'
import { registerUserRoute } from '@/backend/routes/users'
import { listUsersRoute } from '@/backend/routes/admin/users'

// API_ROUTES は簡易的な型と path を定義
// export const API_ROUTES = {
//   auth: {
//     login: {
//       path: '/api/auth/login',
//       method: 'POST',
//       request: {
//         email: '' as string,
//         password: '' as string,
//       },
//       response: {
//         token: '' as string,
//         user: {
//           id: '' as string,
//           email: '' as string,
//           role: 'user' as 'user' | 'admin'
//         }
//       }
//     } satisfies BaseEndpoint
//   },
// } as const;

const usersGetRoute = createRoute({
  method: 'get',
  path: '/users',
  responses: {
    200: {
      description: 'Ok',
      content: {
        'application/json': {
          schema: userListResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request',
      content: {
        'application/json': { schema: z.object({ error: z.string() }) },
      },
    },
  },
})

const authLoginRoute = createRoute({
  method: 'post',
  path: '/auth/login',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: loginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Ok',
      content: {
        'application/json': {
          schema: loginResponseSchema,
        },
      },
    },
  },
})

export const API_ROUTES = {
  users: {
    getUsers: usersGetRoute,
    register: registerUserRoute,
  },
  auth: {
    login: authLoginRoute,
  },
  admin: {
    getUserSearch: listUsersRoute,
  },
} as const

export type ApiRoutes = typeof API_ROUTES
