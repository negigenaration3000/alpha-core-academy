import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/bus';
import { babaStore } from '../services/store';

// Demo personas for instant role-switching & role-based testing
export const DEMO_USERS: Record<UserRole, UserProfile> = {
  super_admin: {
    id: 'usr-admin-01',
    name: 'Admin',
    email: 'admin@busbusbaba.com',
    phone: '+880 1711-000001',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  company_admin: {
    id: 'usr-comp-01',
    name: 'M. A. Malek',
    email: 'director@busbusbaba.com',
    phone: '+880 1711-112233',
    role: 'company_admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  manager: {
    id: 'usr-mgr-01',
    name: 'Kabir Hossain',
    email: 'manager@busbusbaba.com',
    phone: '+880 1711-223344',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  booking_agent: {
    id: 'usr-agent-01',
    name: 'Shakil Ahmed',
    email: 'agent@busbusbaba.com',
    phone: '+880 1711-334455',
    role: 'booking_agent',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  accountant: {
    id: 'usr-acc-01',
    name: 'Fatema Begum',
    email: 'accounts@busbusbaba.com',
    phone: '+880 1711-445566',
    role: 'accountant',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  driver: {
    id: 'usr-drv-01',
    name: 'Rafiqul Islam',
    email: 'rafiq.driver@busbusbaba.com',
    phone: '+880 1812-445566',
    role: 'driver',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  passenger: {
    id: 'usr-psg-01',
    name: 'Md. Rahman',
    email: 'md.rahman@gmail.com',
    phone: '+880 1711-234567',
    role: 'passenger',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Super Admin as seen in dashboard reference screenshot
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bus_bus_baba_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEMO_USERS.super_admin;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bus_bus_baba_current_user', JSON.stringify(user));
      babaStore.setCurrentUser(user);
    } else {
      localStorage.removeItem('bus_bus_baba_current_user');
    }
  }, [user]);

  const login = (email: string, role: UserRole = 'passenger'): boolean => {
    const matchedUser =
      Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
      DEMO_USERS[role] || {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        phone: '+880 1700-000000',
        role,
      };

    setUser(matchedUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEMO_USERS[role];
    if (targetUser) {
      setUser(targetUser);
    }
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        hasPermission,
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
