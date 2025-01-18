import { z } from '../zod-setup'

export const userRegisterRequestSchema = z
  .object({
    name: z.string().openapi({ example: 'test@example.com' }),
    email: z.string().email().openapi({ example: 'test@example.com' }),
    password: z.string().min(8).openapi({ example: 'password123' }),
  })
  .openapi('UserRegisterRequest')

export const userRegisterResponseSchema = z
  .object({
    id: z.string().uuid().nullable(),
    email: z.string().email().openapi({ example: 'test@techvit.me' }),
  })
  .openapi('UserRegisterResponse')

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
})

export const userListResponseSchema = z
  .object({
    data: z.array(userSchema),
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      totalCount: z.number(),
      totalPages: z.number(),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean(),
    }),
  })
  .openapi('UserListResponse')

export const listUsersQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1), // 1ページ目がデフォルト
  pageSize: z.coerce.number().int().min(1).max(100).default(10), // 1~100まで
})

export const adminDashboardResponseSchema = z
  .object({
    secret: z.string(),
  })
  .openapi('UserListResponse')
