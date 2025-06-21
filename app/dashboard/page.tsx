// app/dashboard/page.tsx
"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../components/authProvider';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import ProductList from '../components/productlist';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

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

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome, <span className="text-white">{user.username}</span> 
            <span className="text-sm text-gray-500 ml-2">
              ({isAdmin ? 'Administrator' : 'Regular User'})
            </span>
          </p>
          
          {/* Debug panel */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-2 p-2 bg-[#2a2a2a] rounded text-xs">
              <p>Debug - Email: {user.email}</p>
              <p>Debug - Role: {user.role}</p>
              <p>Debug - isAdmin: {String(isAdmin)}</p>
            </div>
          )}
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