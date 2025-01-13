import { z } from '../zod-setup'

export const loginRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: 'test@example.com' }),
  })
  .openapi('LoginRequest') // スキーマ名

export const loginResponseSchema = z
  .object({
    id: z.string(),
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

export const infoResponseSchema = z
.object({
  title: z.string(),
})
.openapi('UserListResponse')