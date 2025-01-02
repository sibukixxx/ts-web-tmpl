import { z } from '../zod-setup'

export const userRegisterRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: 'test@example.com' }),
    password: z.string().min(8).openapi({ example: 'password123' }),
  })
  .openapi('UserRegisterRequest')

export const userRegisterResponseSchema = z
  .object({
    id: z.string().uuid().nullable(),
    email: z.string().email().openapi({ example: 'test@example.com' }),
  })
  .openapi('UserRegisterResponse')

export const userListResponseSchema = z
  .array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string(),
      createdAt: z.string(),
    }),
  )
  .openapi('UserListResponse')
