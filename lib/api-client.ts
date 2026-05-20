/**
 * Client for fetching real-time person data from the API
 */

export interface APIPersonData {
  personSlug: string;
  personName: string;
  sources: Array<{
    type: string;
    name: string;
    data: Record<string, any>;
    timestamp: string;
    confidence: number;
  }>;
  breakdown: {
    approval: {
      score: number;
      components: Record<string, number>;
    };
    trust: {
      score: number;
      components: Record<string, number>;
    };
    impact: {
      score: number;
      components: Record<string, number>;
    };
    controversy: {
      score: number;
      components: Record<string, number>;
    };
  };
  confidence: number;
  lastUpdated: string;
}

export interface APIResponse {
  success: boolean;
  data?: APIPersonData;
  error?: string;
  message?: string;
}

/**
 * Fetch person data from the API
 * @param slug - Person slug (e.g., 'donald-trump')
 * @returns API data or null if failed
 */
export async function fetchPersonData(slug: string): Promise<APIPersonData | null> {
  try {
    // In Next.js App Router, we can use relative URLs on the server
    // and absolute URLs on the client
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer 
      ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      : '';
    
    const response = await fetch(`${baseUrl}/api/data/person/${slug}`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      console.error(`Failed to fetch data for ${slug}: ${response.status}`);
      return null;
    }

    const result: APIResponse = await response.json();

    if (!result.success || !result.data) {
      console.error(`API returned error for ${slug}:`, result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching data for ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch multiple people's data in parallel
 * @param slugs - Array of person slugs
 * @returns Map of slug to API data (excludes failed fetches)
 */
export async function fetchMultiplePeopleData(
  slugs: string[]
): Promise<Map<string, APIPersonData>> {
  const results = await Promise.allSettled(
    slugs.map(slug => fetchPersonData(slug))
  );

  const dataMap = new Map<string, APIPersonData>();

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      dataMap.set(slugs[index], result.value);
    }
  });

  return dataMap;
}

/**
 * Get score confidence level label
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 80) return 'High';
  if (confidence >= 60) return 'Medium';
  if (confidence >= 40) return 'Low';
  return 'Very Low';
}

/**
 * Format the last updated timestamp
 */
export function formatLastUpdated(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  } catch {
    return timestamp;
  }
}
