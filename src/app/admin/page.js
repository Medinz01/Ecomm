'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './adminpanel.css'

export default function AdminPanel() {
  const { user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', category: '', price: '', image: '',
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (!user) router.push('/login');
    else if (user.role !== 'admin') router.push('/');
    else fetchProducts();
  }, [user, search, category, page, limit]);

  async function fetchProducts() {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(category && { category }),
    });

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: '', description: '', category: '', price: '', image: '' });
      fetchProducts();
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
  <div className="admin-container">
    <h1>Admin Panel</h1>

    <form onSubmit={handleSubmit} className="admin-form">
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="Books">Books</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
      </select>
      <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
      <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
      <button type="submit">Add Product</button>
    </form>

    <hr className="admin-divider" />

    <div className="admin-filters">
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <select value={category} onChange={(e) => {
        setCategory(e.target.value);
        setPage(1);
      }}>
        <option value="">All Categories</option>
        <option value="Books">Books</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
      </select>
    </div>

    <div className="admin-limit-selector">
      <label htmlFor="limit">Products per page:</label>
      <select
        id="limit"
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      >
        {[5, 10, 15, 20].map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
    </div>

    <h3>Existing Products</h3>
    <table border="1" cellPadding={8} className="admin-table">
      <thead>
        <tr><th>Title</th><th>Category</th><th>Price</th></tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.slug}>
            <td>{p.title}</td>
            <td>{p.category}</td>
            <td>₹{p.price}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="admin-pagination">
      <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>◀ Prev</button>
      <span>Page {page} of {totalPages}</span>
      <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next ▶</button>
    </div>
  </div>
);

}
