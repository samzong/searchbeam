import { VercelRequest, VercelResponse } from '@vercel/node'
import app from '../src/app'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await app.ready()
  app.server.emit('request', req, res)
} 