// app/components/authProvider.tsx
"use client"

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type User = {
  id: string;
  email?: string | null;
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check active session and refresh if needed
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        
        // Get session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          return;
        }
        
        if (!session) {
          setUser(null);
          return;
        }
        
        // Process user data
        const authUser = session.user;
        const isAdmin = authUser.email === 'admin@gmail.com';
        
        const userData: User = {
          id: authUser.id,
          email: authUser.email,
          username: authUser.email?.split('@')[0] || 'User',
          role: isAdmin ? 'admin' : 'user'
        };
        
        setUser(userData);
      } catch (error) {
        console.error("Auth error:", error);
        // If there's a refresh token error, clear the session
        if (error instanceof Error && error.message.includes("Refresh Token")) {
          await supabase.auth.signOut();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const authUser = session.user;
          const isAdmin = authUser.email === 'admin@gmail.com';
          
          const userData: User = {
            id: authUser.id,
            email: authUser.email,
            username: authUser.email?.split('@')[0] || 'User',
            role: isAdmin ? 'admin' : 'user'
          };
          
          setUser(userData);
        }
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/sign-in');
        }
        
        if (event === 'TOKEN_REFRESHED') {
          // Refresh completed, no need to do anything
          console.log('Token refreshed successfully');
        }
        
        if (event === 'USER_UPDATED') {
          // User data was updated
          console.log('User updated');
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error instanceof Error ? error : new Error('Unknown error') };
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}