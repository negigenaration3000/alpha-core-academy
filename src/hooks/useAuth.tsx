import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { store } from '../services/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: 'admin' | 'student') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => store.getCurrentUser());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setUser(store.getCurrentUser());
    });

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                store.setCurrentUser(data);
              }
            });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) store.setCurrentUser(data);
            });
        } else {
          // Do not overwrite local admin demo user unless explicitly logged out
        }
      });

      return () => {
        unsubscribe();
        subscription.unsubscribe();
      };
    }

    return unsubscribe;
  }, []);

  const login = async (email: string, _pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: _pass });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) store.setCurrentUser(profile);
      }
      return { success: true };
    }

    // Local authentication fallback
    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('sohel');
    const demoUser: UserProfile = {
      id: isAdmin ? 'usr-admin-01' : `usr-${Date.now()}`,
      full_name: isAdmin ? 'Sohel Shahriar' : email.split('@')[0],
      phone: '01844221100',
      avatar_url: '/images/reference.jpg',
      role: isAdmin ? 'admin' : 'student',
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.setCurrentUser(demoUser);
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string, phone: string = ''): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name, phone },
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    // Local registration
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      full_name: name,
      phone,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'student',
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.setCurrentUser(newUser);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    store.setCurrentUser(null);
  };

  const switchRole = (role: 'admin' | 'student') => {
    store.switchRole(role);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
