import { useState, useEffect } from 'react';

interface User {
  name?: string;
  email?: string;
  picture?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for session cookie
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          setUser(session.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError('Failed to check session');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, isLoading, error };
} 