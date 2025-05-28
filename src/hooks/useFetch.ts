'use client';

import  useAuth  from '@/app/hooks/useAuth';
import { API_BASE_URL } from '@/lib/api-config';

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

export function useFetch() {
  const { user } = useAuth();

  const fetchApi = async (
    endpoint: string,
    options: FetchOptions = {}
  ) => {
    const { auth = false, ...fetchOptions } = options;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (auth && user) {
      headers.Authorization = `Bearer ${user.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return { fetchApi };
} 