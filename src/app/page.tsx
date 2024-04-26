'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    router.push('/login');

  }

  const handleRegister = async (e) => {
    e.preventDefault();
    router.push('/register');

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 mt-5">
      {/* <p>Stuff Goes Here</p>
      <Link href="/register">Link to register page</Link>
      <Link href="/login">Link to login page</Link>
      <Link href="/home">Link to home page</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/welcome">WeSplit</Link> */}
      <div className="flex flex-col items-center justify-center max-h-screen">
        <h2 className='text-2xl mb-4'>Welcome to</h2>
        <h1 className="text-6xl font-bold mb-4 text-yellow-400">WeSplit</h1>
        <p className='mt-3'> Easily manage your bills here</p>
      </div>
      <div className='flex flex-col justify-center'>
        <button type="submit" onClick={handleRegister} className="px-8 py-3 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600 mb-8">Register</button>
        <button type="submit" onClick={handleLogin} className="px-8 py-3 bg-yellow-400 text-white rounded-md transition duration-300 hover:bg-yellow-600">Login</button>
      </div>
    </main>
  );
}