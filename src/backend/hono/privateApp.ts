import { checkAuth, requireAdmin } from '@/backend/lib/auth/supabaseAuth'
import { OpenAPIHono } from '@hono/zod-openapi'
import { API_ROUTES } from '@/backend/routes'

export const privateApp = new OpenAPIHono().basePath('/api/admin')

privateApp.use('*', checkAuth)
privateApp.use('*', requireAdmin)

privateApp.openapi(API_ROUTES.admin.getDashboard, (c) => {
  return c.json({ secret: 'admin only data' })
})
