import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import { comparePassword } from '@/utils/hash';
import { createToken } from '@/lib/auth';
import { sequelize } from '@/lib/db';

export async function POST(req) {
  const { username, password } = await req.json();
  await sequelize.sync();

  const user = await User.findOne({ where: { username } });
  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createToken(user);
  const res = NextResponse.json({ success: true });

  res.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return res;
}
