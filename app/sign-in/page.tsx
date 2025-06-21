// app/sign-in/page.tsx
"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/authProvider';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const { error } = await signIn(email, password);

      if (error) {
        setErrorMessage(error.message);
      }
      // Redirect happens automatically in useEffect when user changes
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold">Sign In</h1>
            <p className="text-gray-400 mt-2">Enter your credentials to access your account</p>
          </div>
          
          {errorMessage && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded mb-6 text-sm">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSignIn} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#252525] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] transition duration-150"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}