"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import ProductList from '../components/productlist';
import { getUserSession } from '../lib/getSession';

type User = {
  id: string;
  email?: string | null;
  username: string;
  role: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const { user, error: sessionError } = await getUserSession();
        
        if (sessionError || !user) {
          router.push('/sign-in');
          return;
        }
        
        // Log data user untuk debugging
        console.log("User data:", user);
        console.log("User email:", user.email);
        console.log("User role:", user.role);
        
        setUser(user);
      } catch (_error) {
        setError('Failed to load user session');
        router.push('/sign-in');
      } finally {
        setLoading(false);
      }
    }
    
    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Gunakan perbandingan ketat (strict equality)
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome, <span className="text-white">{user?.username || 'User'}</span> 
            <span className="text-sm text-gray-500 ml-2">
              ({isAdmin ? 'Administrator' : 'Regular User'})
            </span>
          </p>
          
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-medium mb-4">Product Inventory</h2>
          <ProductList isAdmin={isAdmin} />
        </div>
      </main>
      <Footer />
    </div>
  );
}