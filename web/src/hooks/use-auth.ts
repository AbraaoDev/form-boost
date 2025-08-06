import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/http/get-profile';

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: getProfile,
    retry: false,
    staleTime: Infinity,
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
  };
} 