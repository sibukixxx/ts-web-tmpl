// src/store/index.ts
import { create } from 'zustand'
import { createFormSlice, FormSlice } from './formSlice'
import { useUserStore } from './userStore'

/**
 * store のルート型
 *  - 複数 slice を使うならここで & で合体
 */
type RootStore = FormSlice

/**
 * ルートの zustand ストアを作成
 */
export const useRootStore = create<RootStore>()((...a) => ({
  // フォーム用 slice を組み込む
  ...createFormSlice(...a),
}))
