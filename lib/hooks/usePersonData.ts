import { useState, useEffect } from 'react';
import { AggregatedData } from '../../types';

export function usePersonData(slug: string) {
  const [data, setData] = useState<AggregatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/data/person/${slug}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return { data, loading, error };
}

export async function refreshPersonData(slug: string, token: string) {
  try {
    const response = await fetch('/api/data/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error refreshing data:', error);
    throw error;
  }
}

export async function refreshAllData(token: string) {
  try {
    const response = await fetch('/api/data/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ all: true }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error refreshing all data:', error);
    throw error;
  }
}
