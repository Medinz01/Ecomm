'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './login.css';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      await login();
      router.push('/home');
    } else {
      alert('Login failed');
    }
  }

  return (
    <div className="login-body">
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Welcome Back</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" className="hex-button">Login</button>
      <p>
        If not a user: <a href="/register">Register!</a>
      </p>
    </form>
    </div>
  );
}
