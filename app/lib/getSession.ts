import { supabase } from './supabaseClient';

export async function getUserSession() {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return { user: null, error: sessionError };
    }

    if (!sessionData.session) {
      return { user: null, error: null };
    }

    const authUser = sessionData.session.user;
    
    const isAdmin = authUser.email === 'admin@gmail.com';
    

    const user = {
      id: authUser.id,
      email: authUser.email,
      username: authUser.email?.split('@')[0] || 'User', 
    };
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}