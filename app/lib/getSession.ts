import { supabase } from './supabaseClient';

type User = {
  id: string;
  email?: string | null;
  username: string;
  role: string;
};

type SessionResponse = {
  user: User | null;
  error: Error | null;
};

export async function getUserSession(): Promise<SessionResponse> {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return { user: null, error: sessionError };
    }

    if (!sessionData.session) {
      return { user: null, error: null };
    }

    const authUser = sessionData.session.user;
    
    // Pastikan email yang digunakan benar dan menggunakan perbandingan yang tepat
    const role = authUser.email === 'admin@gmail.com' ? 'admin' : 'user';
    
    const user: User = {
      id: authUser.id,
      email: authUser.email,
      username: authUser.email?.split('@')[0] || 'User',
      role: role
    };
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}