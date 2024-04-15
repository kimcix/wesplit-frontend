import Link from 'next/link';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Stuff Goes Here</p>
      <Link href="/register">Link to register page</Link>
      <Link href="/login">Link to login page</Link>
      <Link href="/home">Link to home page</Link>
      <Link href="/profile">Profile</Link>
    </main>
  );
}
