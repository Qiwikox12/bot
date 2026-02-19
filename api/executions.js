// api/executions.js — CommonJS версия
const kv = require('@vercel/kv').kv;  // или const { kv } = require('@vercel/kv');

const KEY = 'total_executions';

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const count = await kv.get(KEY);
      return res.status(200).json({ total: count ? Number(count) : 0 });
    }

    if (req.method === 'POST') {
      const newCount = await kv.incr(KEY);
      return res.status(200).json({ total: newCount });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Error:', error.message || error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
