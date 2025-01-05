import { z } from 'zod'

export const userSchema = z
  .object({
    username: z.string().min(3, { message: 'ユーザー名は3文字以上である必要があります' }),
    email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
    password: z.string().min(8, { message: 'パスワードは8文字以上である必要があります' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

export type UserFormData = z.infer<typeof userSchema>
