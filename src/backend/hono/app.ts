// src/hono/app.ts
import { Hono } from 'hono'
import type { Context } from 'hono'

export const app = new Hono().basePath('/api')

app.get('/user', (c: Context) => {
  return c.json([{ id: 1, name: 'Alice' }])
})

app.get('/users', (c: Context) => {
  return c.json([
    { id: 1, name: 'Alice' },

    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ])
})

// 例: POST /users
app.post('/users', async (c: Context) => {
  const { name } = await c.req.json<{ name: string }>()
  return c.json({ id: 3, name }, 201)
})

// 例: GET /hello/:name
app.get('/hello/:name', (c: Context) => {
  const name = c.req.param('name')
  return c.text(`Hello, ${name}!`)
})
