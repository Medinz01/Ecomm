import './products.css';
import { Product } from '@/models/Products';
import { sequelize } from '@/lib/db';


export default async function ProductPage({ params }) {
  const { slug } = await params;
  await sequelize.sync();
  const product = await Product.findOne({ where: { slug } });

  if (!product) return <h1>Product not found</h1>;

  return (
    <div className="product-container">
      <h1>{product.title}</h1>
<img src={`/${product.image}`} alt={product.title} className="product-image" />
<div className="product-details">
  <p><strong>Category:</strong> {product.category}</p>
  <p><strong>Price:</strong> ₹{product.price}</p>
  <p>{product.description}</p>
</div>

    </div>
  );
}
