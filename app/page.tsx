"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Footer from './components/footer';
import Navbar from './components/navbar';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div>
      <Navbar/>
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirecting to dashboard...</p>
      </div>
      <Footer/>
    </div>
  );
}