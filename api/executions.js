import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const KEY = 'total_executions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const count = (await kv.get<number>(KEY)) ?? 0;
    return res.status(200).json({ total: count });
  }

  if (req.method === 'POST') {
    const newCount = await kv.incr(KEY);
    return res.status(200).json({ total: newCount });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
