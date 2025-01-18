import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello from public API' })
}

// POSTメソッドが必要な場合
export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Posted to public API' })
}
