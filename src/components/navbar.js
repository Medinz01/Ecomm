'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import './navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link href="/" className="nav-route">Home</Link>
        {user ? (
          <>
            {user.role === 'admin' && <Link href="/admin" className="nav-route">Admin Panel</Link>}
            <button onClick={handleLogout} className="nav-route">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="nav-route">Login/Register</Link>
        )}
      </div>
    </nav>
  );
}
