import { checkAuth, requireLogin } from '@/backend/lib/auth/supabaseAuth'
import { OpenAPIHono } from '@hono/zod-openapi'
import { API_ROUTES } from '@/backend/routes'

export const mypageApp = new OpenAPIHono().basePath('/api/mypage')

mypageApp.use('*', checkAuth)
mypageApp.use('*', requireLogin)
