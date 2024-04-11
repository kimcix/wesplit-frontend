// pages/register.js

'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/register', { // Adjust your backend port if necessary
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage('User registered successfully!');
      router.push('/')
    } else {
      setMessage(data.error || 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Register</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input className="w-full px-3 py-2 border rounded-md" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input className="w-full px-3 py-2 border rounded-md" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input className="w-full px-3 py-2 border rounded-md" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button className="w-full px-4 py-2 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600 mt-4" type="submit">Register</button>
      </form>
    </div>
  );
}
