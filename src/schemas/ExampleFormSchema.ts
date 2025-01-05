import { z } from 'zod'

/**
 * 大規模フォームを想定するが、サンプルとして3フィールドだけ。
 * 実際はここに50項目以上を定義するイメージ。
 */
export const formSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  age: z.number().min(0, '年齢は0以上で'),
  email: z.string().email('正しいメール形式で入力してください').optional(),
})

export type FormData = z.infer<typeof formSchema>
