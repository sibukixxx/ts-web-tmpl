import { supabase } from '@/shared/utils/supabase'
import { OpenAPIHono } from '@hono/zod-openapi'
import { API_ROUTES } from '@/backend/routes'

export function makeRegisterUserHandler(app: OpenAPIHono) {
  return app.openapi(API_ROUTES.users.register, async (c) => {
    const body = c.req.valid('json')

    const { email, password } = body

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      return c.json(
        { error: error.message },
        { status: 400 }, // 明示的に `status` を指定
      )
    }

    return c.json(
      {
        id: data.user?.id || null, // スキーマに一致するように `null` を許容
        email: data.user?.email || '',
      },
      { status: 201 }, // 明示的に `status` を指定
    )
  })
}
