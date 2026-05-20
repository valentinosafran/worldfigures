'use client';

import { useState, useEffect } from 'react';

interface InlineVoteDisplayProps {
  slug: string;
}

export function InlineVoteDisplay({ slug }: InlineVoteDisplayProps) {
  const [netVotes, setNetVotes] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const response = await fetch(`/api/vote?slug=${slug}`);
        const result = await response.json();
        
        if (result.success) {
          setNetVotes(result.data.netVotes);
        }
      } catch (error) {
        console.error('Error fetching votes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVotes();
  }, [slug]);

  if (isLoading || netVotes === null) {
    return null;
  }

  // Don't show if no votes yet
  if (netVotes === 0) {
    return null;
  }

  const isPositive = netVotes > 0;
  const displayValue = isPositive ? `+${netVotes}` : netVotes;

  return (
    <span 
      className="inlineVoteCount"
      style={{
        marginLeft: '6px',
        fontSize: '0.85em',
        padding: '2px 6px',
        borderRadius: '4px',
        backgroundColor: isPositive 
          ? 'rgba(34, 197, 94, 0.15)'
          : 'rgba(239, 68, 68, 0.15)',
        color: isPositive ? '#4ade80' : '#f87171',
        fontWeight: '600',
      }}
      title="Community vote score"
    >
      {displayValue} ▲
    </span>
  );
}
