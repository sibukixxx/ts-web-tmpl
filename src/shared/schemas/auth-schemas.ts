import { z } from './zod-setup'

export const loginRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: 'test@example.com' }),
    // password: z.string().min(1).openapi({ example: "secret123" }),
  })
  .openapi('LoginRequest') // スキーマ名

export const loginResponseSchema = z
  .object({
    id: z.string(),
    // user: z.object({
    //   id: z.string().openapi({ example: "user-id-1" }),
    //   email: z.string().openapi({ example: "test@example.com" }),
    // role: z.enum(['user', 'admin']).openapi({ example: "user" }),
    // }),
  })
  .openapi('LoginResponse')

export const userListResponseSchema = z
  .object({
    users: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  })
  .openapi('UserListResponse')
