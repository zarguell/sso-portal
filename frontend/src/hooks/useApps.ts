import { useState, useEffect } from 'react';

// Corresponds to backend/shared/types.ts
interface App {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  ssoUrl: string;
}

interface User {
    email: string;
    displayName: string;
}

interface GetAppsResponse {
    user: User;
    apps: App[];
}

const useApps = () => {
  const [data, setData] = useState<GetAppsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // In a real app, you'd get the token from your auth provider
        const MOCK_TOKEN = 'your-jwt-token';
        
        const response = await fetch('/api/apps', {
          headers: {
            'Authorization': `Bearer ${MOCK_TOKEN}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const result: GetAppsResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  return { data, isLoading, error };
};

export default useApps;
