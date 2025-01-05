import { z } from 'zod'

/**
 * ユーザー検索 API のクエリパラメータをバリデーションするスキーマ
 * - page: ページ番号 (1以上)
 * - pageSize: 1ページあたりの件数 (1以上)
 * - search: 検索キーワード (任意)
 */
export const userSearchSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= 1, { message: 'page must be >= 1' }),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val >= 1, { message: 'pageSize must be >= 1' }),
  search: z.string().optional(),
})

export type UserSearchParams = z.infer<typeof userSearchSchema>
