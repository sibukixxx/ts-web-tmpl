// src/store/formSlice.ts
import { StateCreator } from 'zustand'
import { formSchema, FormData } from '@/schemas/ExampleFormSchema'

export type FormErrors = {
  [key in keyof FormData]?: string // 各フィールドに対し、エラーメッセージを保持
}

/**
 * フォーム関連の slice が持つ状態とメソッド
 */
export interface FormSlice {
  // バリデーション結果（エラーメッセージ）
  errors: FormErrors

  // バリデーションを実行し、エラーを更新するメソッド
  validateForm: (data: FormData) => boolean
}

/**
 * createFormSlice: Zustand の slice パターン
 *  - 他の slice と組み合わせて最終的に create() される
 */
export const createFormSlice: StateCreator<FormSlice, [], [], FormSlice> = (set, get) => ({
  errors: {},

  validateForm: (data) => {
    try {
      // Zod parse（失敗すると例外が投げられる）
      formSchema.parse(data)
      // 成功 → エラーをクリア
      set({ errors: {} })
      return true
    } catch (err) {
      // ここでは ZodError をパースしてフィールドごとのメッセージに変換
      if (err instanceof Error && 'issues' in err) {
        const zodError = err as any // z.ZodError<FormData>
        const newErrors: FormErrors = {}
        zodError.issues.forEach((issue: any) => {
          const path = issue.path[0] as keyof FormData
          newErrors[path] = issue.message
        })
        // Zustand ストアにエラーを反映
        set({ errors: newErrors })
      }
      return false
    }
  },
})
