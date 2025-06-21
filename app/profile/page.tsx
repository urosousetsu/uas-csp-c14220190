"use client"

import { Alert, Button, Card, Label, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { getUserSession } from '../lib/getSession';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'failure', text: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { user, error } = await getUserSession();
      
      if (error || !user) {
        router.push('/sign-in');
        return;
      }
      
      setUser(user);
      setUsername(user.username || '');
      setLoading(false);
    }
    
    loadProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setMessage({type: 'failure', text: 'Username cannot be empty'});
      return;
    }
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ username })
        .eq('id', user.id);
      
      if (error) {
        setMessage({type: 'failure', text: error.message});
      } else {
        setMessage({type: 'success', text: 'Profile updated successfully'});
      }
    } catch (error) {
      setMessage({type: 'failure', text: 'Failed to update profile'});
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        {message && (
          <Alert color={message.type} className="mb-4">
            {message.text}
          </Alert>
        )}
        
        <Card>
          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <TextInput
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Role</Label>
                <p className="mt-1">{user.role}</p>
              </div>
              
              <Button type="submit" disabled={updating}>
                {updating ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}