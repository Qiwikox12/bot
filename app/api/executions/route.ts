import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const KEY = 'total_executions'; // или 'exec:total' для namespace

export async function GET() {
  const count = await kv.get<number>(KEY) ?? 0;
  return NextResponse.json({ total: count });
}

export async function POST() {
  // Атомарный инкремент +1
  const newCount = await kv.incr(KEY);
  return NextResponse.json({ total: newCount });
}
