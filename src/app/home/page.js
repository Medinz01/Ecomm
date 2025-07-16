'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './home.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;
  // inside HomePage component
const [currentSlide, setCurrentSlide] = useState(0);

// Auto-scroll every 5s
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % featured.length);
  }, 5000);
  return () => clearInterval(interval);
}, [featured]);

const handlePrev = () => {
  setCurrentSlide((prev) => (prev - 1 + featured.length) % featured.length);
};

const handleNext = () => {
  setCurrentSlide((prev) => (prev + 1) % featured.length);
};


  const fetchProducts = async () => {
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

    // Randomly pick 5 for featured section
    const shuffled = [...data.products].sort(() => 0.5 - Math.random());
    setFeatured(shuffled.slice(0, 5));
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  return (
    <>
      {/* Featured Slider */}
<div className="featured-container">
  <div
    className="featured-slider"
    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
  >
    {featured.map((p) => (
      <Link key={p.slug} href={`/products/${p.slug}`} className="featured-slide" style={{ backgroundImage: `url(/${p.image})` }}>
        <div className="featured-slide-content">
          <h3>{p.title}</h3>
          <p><strong>₹{p.price}</strong></p>
          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{p.category}</p>
        </div>
      </Link>
    ))}
  </div>

  {/* Nav Buttons */}
  <button className="featured-nav-btn prev" onClick={handlePrev}>❮</button>
  <button className="featured-nav-btn next" onClick={handleNext}>❯</button>
</div>


      {/* Main Content */}
      <div className="home-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>🔍 Search</h3>
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <h3>📂 Category</h3>
          <ul>
            {['', 'Action', 'Adventure', 'RPG'].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    setCategory(cat);
                    setPage(1);
                  }}
                  className={`sidebar-button${category === cat ? ' active' : ''}`}
                >
                  {cat === '' ? 'All' : cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product Cards */}
        <main>
          <h1>Games:</h1>
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.slug} className="product-card">
                <Link href={`/products/${p.slug}`}>
                  <img src={`/${p.image}`} alt={p.title} />
                  <h3>{p.title}</h3>
                  <p><strong>${p.price}</strong></p>
                  <p style={{ fontSize: '0.8rem', color: '#999' }}>{p.category}</p>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              ◀ Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next ▶
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
