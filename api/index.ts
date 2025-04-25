// Vercel Serverless函数适配文件
import { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../src/app';

// 导出Vercel函数处理器
export default async function (req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
} 