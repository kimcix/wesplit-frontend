// pages/login.tsx

'use client'

import { useState } from 'react';
import Image from 'next/image';

interface LoginPageProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
}

const LoginPage = ({ username, password, setUsername, setPassword }: LoginPageProps) => {
  const [formData, setFormData] = useState({ username: username, password: password });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Submitted:', formData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-8">
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
      </div>
      <form className="w-64" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-blue-600">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

// Server Component code
export async function getServerComponentProps() {
  // Fetch username and password from somewhere, e.g., database, server-side session, etc.
  const username = 'initialUsername';
  const password = 'initialPassword';

  return { props: { username, password } };
}
