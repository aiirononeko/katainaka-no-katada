import { Hono } from 'hono'
import { handle } from 'hono-remix-adapter'

const app = new Hono()
app.use(async (c, next) => {
  await next()
  c.header('X-Powered-By', 'Remix and Hono')
})

export default handle(app)
