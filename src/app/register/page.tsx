// pages/register.js

'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userManagementAPIPrefix } from '../components/apiPrefix';


export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(userManagementAPIPrefix+'/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();
    console.log('data', data);
    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.username);
      setMessage('User registered successfully!');
      router.push('/profile')
    } else {
      setMessage(data.error || 'An error occurred');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    router.push('/login');
  }

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
        <div className="flex justify-center space-x-4">
          <button className="flex-grow px-4 py-2 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600 mt-4" type="submit">Register</button>
          <button type="submit" onClick={handleLoginSubmit} className="flex-grow px-4 py-2 mt-4 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Login</button>
        </div>
      </form>
    </div>
  );
}
