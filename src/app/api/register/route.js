import { NextResponse } from 'next/server';
import { sequelize } from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword } from '@/utils/hash';

export async function POST(req) {
  const { username, password } = await req.json();
  await sequelize.sync();

  const existing = await User.findOne({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashed = await hashPassword(password);

  // ✅ Check if this is the first user
  const userCount = await User.count();
  const role = userCount === 0 ? 'admin' : 'user';

  await User.create({ username, password: hashed, role });

  return NextResponse.json({ success: true });
}
