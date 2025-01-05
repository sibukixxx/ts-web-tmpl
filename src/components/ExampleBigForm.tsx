// src/components/BigForm.tsx
'use client' // Next.js App Routerでのクライアントコンポーネントの場合

import React, { useRef } from 'react'
import { useRootStore } from '@/stores'

/**
 * 本来は 50項目以上ある想定。
 * サンプルとして 3 フィールド分だけ。
 */
type LocalFormData = {
  name: string
  age: string // 入力は string で受け取る
  email: string // optional
}

export default function BigForm() {
  // Zustand からエラーのみ取得 (errors が変わると再レンダリング)
  const errors = useRootStore((state) => state.errors)
  const validateForm = useRootStore((state) => state.validateForm)

  /**
   * フォーム入力値を useRef で管理
   *  -> 入力のたびに再レンダリングを引き起こさない
   */
  const formRef = useRef<LocalFormData>({
    name: '',
    age: '',
    email: '',
  })

  // 入力時に呼ばれるハンドラ
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    // name="name" or name="age" or name="email"
    ;(formRef.current as any)[name] = value
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // useRef にある string データを number など正しい型に変換 → Zodチェック
    const finalData = {
      name: formRef.current.name.trim(),
      age: Number(formRef.current.age) || 0,
      email: formRef.current.email.trim() || undefined,
    }

    const isValid = validateForm(finalData)
    if (!isValid) {
      // エラーがある場合はエラーメッセージがZustandストアに設定されている
      // 再レンダされて errors が表示される
      return
    }

    // バリデーション成功時の処理
    alert(`バリデ成功！${JSON.stringify(finalData, null, 2)}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <div>
        <label>名前</label>
        <input
          name="name"
          type="text"
          defaultValue="" // 初期値
          onChange={handleChange}
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
      </div>

      <div>
        <label>年齢</label>
        <input name="age" type="number" defaultValue="" onChange={handleChange} />
        {errors.age && <p style={{ color: 'red' }}>{errors.age}</p>}
      </div>

      <div>
        <label>メール</label>
        <input name="email" type="email" defaultValue="" onChange={handleChange} />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>

      {/* 大量のフィールドがあるなら同様に... */}
      <button type="submit">送信</button>
    </form>
  )
}
