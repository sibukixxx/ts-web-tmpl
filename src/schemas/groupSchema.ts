import { z } from 'zod'

export const groupSchema = z.object({
  name: z.string().min(3, { message: 'グループ名は3文字以上である必要があります' }),
  description: z.string().max(500, { message: '説明は500文字以内である必要があります' }).optional(),
})

export type GroupFormData = z.infer<typeof groupSchema>
