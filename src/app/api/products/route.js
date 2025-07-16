import { NextResponse } from 'next/server';
import { Product } from '@/models/Products';
import { sequelize } from '@/lib/db';
import { Op } from 'sequelize';


export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  await sequelize.sync();

  const { rows: products, count } = await Product.findAndCountAll({
    where,
    offset,
    limit,
    order: [['createdAt', 'DESC']]
  });

  return NextResponse.json({
    products,
    total: count,
    page,
    totalPages: Math.ceil(count / limit)
  });
}

export async function POST(req) {
  const { title, description, category, price, image } = await req.json();
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  await sequelize.sync();
  const existing = await Product.findOne({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Product already exists' }, { status: 400 });
  }

  const newProduct = await Product.create({
    title, slug, description, category, price, image,
  });

  return NextResponse.json(newProduct);
}
