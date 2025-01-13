// 管理系API のみ有効にするルート
// 下記はダミー
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello from private API' })
}

// POSTメソッドが必要な場合
export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Posted to private API' })
}