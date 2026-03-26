'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { API_BASE_URL } from '@/app/lib/websocket';

interface AdminAuthContextType {
  token: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isVerifying: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const login = useCallback(async (password: string) => {
    if (!password.trim() || isVerifying) return false;
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${password.trim()}` },
      });
      if (res.ok) {
        setToken(password.trim());
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying]);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, isVerifying }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
