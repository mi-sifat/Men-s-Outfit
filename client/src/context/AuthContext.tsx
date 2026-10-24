import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'owner' | 'admin' | 'order_manager' | 'inventory_manager' | 'customer';
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  setupAdmin: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  hasAdminConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'mens_outfit_admin_user';
const AUTH_TOKEN_KEY = 'mens_outfit_admin_token';
const ADMIN_CRED_HASH = 'mens_outfit_local_admin_cred';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasAdminConfigured, setHasAdminConfigured] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try backend verification first
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = localStorage.getItem(AUTH_USER_KEY);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);

          // Attempt verify against backend
          try {
            const res = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            if (res.ok) {
              const data = await res.json();
              if (data?.data?.user) {
                setUser(data.data.user);
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
              }
            } else if (res.status === 401 || res.status === 403) {
              // Token expired on server
              logout();
            }
          } catch {
            // Backend offline - persist local session
          }
        }

        // Check if admin is configured on server or locally
        try {
          const res = await fetch('/api/auth/admin-status');
          if (res.ok) {
            const data = await res.json();
            setHasAdminConfigured(Boolean(data?.data?.hasAdmin));
          } else {
            const localCred = localStorage.getItem(ADMIN_CRED_HASH);
            setHasAdminConfigured(Boolean(localCred));
          }
        } catch {
          // If offline/serverless standalone, check configured admin
          const localCred = localStorage.getItem(ADMIN_CRED_HASH);
          setHasAdminConfigured(Boolean(localCred));
        }
      } catch (e) {
        console.warn('Auth initialization error', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Attempt API server authentication
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await res.json();
          if (res.ok && result?.data?.user) {
            const u = result.data.user;
            // Verify admin role
            if (u.role === 'customer') {
              throw new Error('আপনার একাউন্টে অ্যাডমিন ড্যাশবোর্ড ব্যবহারের অনুমতি নেই।');
            }
            setUser(u);
            setToken(result.data.token);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
            localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
            return { success: true, message: 'লগইন সফল হয়েছে!' };
          } else if (!res.ok) {
            throw new Error(result?.message || 'ভুল ইমেইল বা পাসওয়ার্ড।');
          }
        }
      } catch (apiError: any) {
        // If API threw explicit authorization error (e.g. wrong password or rate limit), rethrow
        if (apiError.message && !apiError.message.includes('fetch') && !apiError.message.includes('NetworkError')) {
          return { success: false, message: apiError.message };
        }
      }

      // 2. Fallback for standalone demo / offline mode: verify against user-configured credentials
      const localCredRaw = localStorage.getItem(ADMIN_CRED_HASH);
      let isValidLocal = false;
      let localUser: AdminUser | null = null;

      if (localCredRaw) {
        const localCred = JSON.parse(localCredRaw);
        if (localCred.email === cleanEmail && localCred.password === password) {
          isValidLocal = true;
          localUser = {
            id: localCred.id || 'admin-local-1',
            name: localCred.name || 'Store Administrator',
            email: localCred.email,
            role: 'owner',
          };
        }
      }

      if (isValidLocal && localUser) {
        const sessionToken = `session-token-${Date.now()}`;
        setUser(localUser);
        setToken(sessionToken);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(localUser));
        localStorage.setItem(AUTH_TOKEN_KEY, sessionToken);
        return { success: true, message: 'লগইন সফল হয়েছে!' };
      }

      return { success: false, message: 'ভুল ইমেইল বা পাসওয়ার্ড। পুনরায় চেষ্টা করুন।' };
    } catch (err: any) {
      return { success: false, message: err.message || 'লগইন প্রক্রিয়া ব্যর্থ হয়েছে।' };
    } finally {
      setIsLoading(false);
    }
  };

  const setupAdmin = async (data: { name: string; email: string; password: string; phone?: string }): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      try {
        const res = await fetch('/api/auth/setup-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await res.json();
          if (res.ok && result?.data?.user) {
            setUser(result.data.user);
            setToken(result.data.token);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.data.user));
            localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
            setHasAdminConfigured(true);
            return { success: true, message: 'অ্যাডমিন একাউন্ট সফলভাবে সক্রিয় হয়েছে!' };
          } else if (!res.ok) {
            throw new Error(result?.message || 'সেটআপ ব্যর্থ হয়েছে।');
          }
        }
      } catch (err: any) {
        if (err.message && !err.message.includes('fetch')) {
          return { success: false, message: err.message };
        }
      }

      // Offline fallback
      const cleanEmail = data.email.trim().toLowerCase();
      const newAdmin: AdminUser = {
        id: `admin-${Date.now()}`,
        name: data.name.trim(),
        email: cleanEmail,
        phone: data.phone?.trim(),
        role: 'owner',
      };
      localStorage.setItem(ADMIN_CRED_HASH, JSON.stringify({ ...newAdmin, password: data.password }));
      const dummyToken = `local-token-${Date.now()}`;
      setUser(newAdmin);
      setToken(dummyToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newAdmin));
      localStorage.setItem(AUTH_TOKEN_KEY, dummyToken);
      setHasAdminConfigured(true);

      return { success: true, message: 'প্রথম অ্যাডমিন সফলভাবে তৈরি হয়েছে!' };
    } catch (e: any) {
      return { success: false, message: e.message || 'অ্যাডমিন তৈরি ব্যর্থ হয়েছে।' };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (token && !token.startsWith('demo-') && !token.startsWith('local-')) {
        const res = await fetch('/api/auth/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result?.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
        }
        return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' };
      }

      // Local fallback
      const localCredRaw = localStorage.getItem(ADMIN_CRED_HASH);
      if (localCredRaw) {
        const cred = JSON.parse(localCredRaw);
        if (cred.password !== currentPassword) {
          return { success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' };
        }
        cred.password = newPassword;
        localStorage.setItem(ADMIN_CRED_HASH, JSON.stringify(cred));
        return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!' };
      }

      return { success: true, message: 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!' };
    } catch (e: any) {
      return { success: false, message: e.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && user.role !== 'customer',
        isLoading,
        login,
        logout,
        setupAdmin,
        changePassword,
        hasAdminConfigured,
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
