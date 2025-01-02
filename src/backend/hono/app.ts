import { API_ROUTES } from '@/backend/routes'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { makeRegisterUserHandler } from '@/backend/handlers/userHandler'

export const app = new OpenAPIHono().basePath('/api')

// app.openapi(API_ROUTES.auth.login, async c => {
//   return c.json({
//     id: 'generated',
//   })
// });

app.openapi(API_ROUTES.auth.login, async (c) => {
  c.req.valid('json')
  return c.json({
    id: 'user-id-1',
  })
})

makeRegisterUserHandler(app)

app.onError((err, c) => {
  return c.json({ message: err.message }, 500)
})

app
  .doc('/specification', {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
    },
  })
  .get(
    '/doc',
    swaggerUI({
      url: '/api/specification',
    }),
  )

// app.get('/user', (c: Context) => {
//   return c.json([{ id: 1, name: 'Alice' }])
// })
//
// app.get('/users', (c: Context) => {
//   return c.json([
//     { id: 1, name: 'Alice' },
//     { id: 2, name: 'Bob' },
//   ])
// })
//
// // 例: POST /users
// app.post('/users', async (c: Context) => {
//   const { name } = await c.req.json<{ name: string }>()
//   return c.json({ id: 3, name }, 201)
// })
//
// // 例: GET /hello/:name
// app.get('/hello/:name', (c: Context) => {
//   const name = c.req.param('name')
//   return c.text(`Hello, ${name}!`)
// })
