// pages/login.tsx

'use client'

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const response = await fetch('http://127.0.0.1:5000/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });


    if (response.ok){
      const data = await response.json();
      // Handle your token here, store it in state, or save it in localStorage/sessionStorage
      console.log('Access Token:', data.access_token);
      setMessage('User registered successfully!');
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.access_token);
      }
      router.push('/profile');
    }else{
      const data = await response.json();
      setMessage(data.error || 'An error occurred');
    }
    
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Log In</h1>
      <div className="mb-8">
        {/* insert image gere */}
      </div>
      <form className="w-64" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button type="submit" className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Login</button>
          <button type="submit" className="flex-grow px-4 py-2 mt-4 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Back</button>
        </div>

      </form>
    </div>
  );

}

// interface LoginPageProps {
//   username: string;
//   password: string;
//   setUsername: (username: string) => void;
//   setPassword: (password: string) => void;
// }

// const LoginPage = ({ username, password, setUsername, setPassword }: LoginPageProps) => {
//   const [formData, setFormData] = useState({ username: username, password: password });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // Add your login logic here
//     console.log('Submitted:', formData);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-4xl font-bold mb-4">Log In</h1>
//       <div className="mb-8">
//         {/* insert image gere */}
//       </div>
//       <form className="w-64" onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="username" className="block mb-1">Username</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="password" className="block mb-1">Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border rounded-md"
//             required
//           />
//         </div>
//         <button type="submit" className="w-full px-4 py-2 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// // Server Component code
// export async function getServerComponentProps() {
//   // Fetch username and password from somewhere, e.g., database, server-side session, etc.
//   const username = 'initialUsername';
//   const password = 'initialPassword';

//   return { props: { username, password } };
// }
