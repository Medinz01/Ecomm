// app/api/me/route.js
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const payload = token && await verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  return NextResponse.json({ user: payload });
}
