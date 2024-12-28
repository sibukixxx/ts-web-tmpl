import { NextRequest } from 'next/server'
import { app } from '@/backend/hono/app'

export async function GET(req: NextRequest) {
  return app.fetch(req)
}

export async function POST(req: NextRequest) {
  return app.fetch(req)
}