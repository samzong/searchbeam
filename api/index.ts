// Vercel Serverless function adapter file
import { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../src/app';

// Export Vercel function handler
export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
} 