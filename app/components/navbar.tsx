"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserSession } from '../lib/getSession';
import { supabase } from '../lib/supabaseClient';

type User = {
  id: string;
  email?: string | null;
  username: string;
  role: string;
};

export default function NavbarComponent() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const { user } = await getUserSession();
      if (user) {
        // Assign a default role if missing, or fetch the role as needed
        setUser({
          id: user.id,
          email: user.email ?? null,
          username: user.username,
          role: (user as any).role ?? 'user', // Replace with actual role fetching logic if needed
        });
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/sign-in');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-medium">
              <span className="text-blue-400">P</span>roduct<span className="text-blue-400">M</span>anager
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              
              {user ? (
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-300 mr-2">
                      {user.username} 
                      {isAdmin && <span className="ml-1 text-blue-400">(Admin)</span>}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-200 text-sm px-3 py-1 rounded-md"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/sign-in" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Dashboard
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-[#2a2a2a]">
          {user ? (
            <div className="px-2">
              <div className="px-3 py-2 text-gray-400">
                <div className="text-base font-medium">
                  {user.username}
                  {isAdmin && <span className="ml-1 text-blue-400">(Admin)</span>}
                </div>
                <div className="text-sm">{user.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-1 w-full flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#3a3a3a]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-2">
              <Link
                href="/sign-in"
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}