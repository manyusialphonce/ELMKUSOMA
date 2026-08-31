import { useEffect } from 'react';
import AppRouter from './router';
import useAuthStore from './stores/authStore';

export default function App() {
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return <AppRouter />;
}
