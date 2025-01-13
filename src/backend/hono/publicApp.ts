import { checkAuth } from '@/backend/lib/auth/supabaseAuth'
import {OpenAPIHono} from "@hono/zod-openapi";
import {API_ROUTES} from "@/backend/routes";

export const publicApp = new OpenAPIHono().basePath('/api')

publicApp.use('*', checkAuth)

publicApp.openapi(API_ROUTES.users.getInfo, (c) => {
  return c.json({
    title: 'user-id-1',
  })
})