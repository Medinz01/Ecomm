'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './register.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) router.push('/login');
    else alert('Registration failed');
  };

  return (
    <form onSubmit={handleRegister} className="register-form">
  <h2>Register</h2>
  <input
    value={username}
    onChange={e => setUsername(e.target.value)}
    placeholder="Username"
    required
  />
  <input
    type="password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    placeholder="Password"
    required
  />
  <button type="submit">Register</button>
  <p>
    If already a user: <a href="/login">Login!</a>
  </p>
</form>

  );
}
