'use client';

import { useState, useEffect } from 'react';

interface VoteButtonProps {
  slug: string;
  compact?: boolean;
}

export function VoteButton({ slug, compact = false }: VoteButtonProps) {
  const [netVotes, setNetVotes] = useState<number>(0);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Generate or retrieve user ID
  useEffect(() => {
    let id = localStorage.getItem('worldfigures_voter_id');
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('worldfigures_voter_id', id);
    }
    setUserId(id);
  }, []);

  // Fetch current vote status
  useEffect(() => {
    if (!userId) return;

    async function fetchVotes() {
      try {
        const response = await fetch(`/api/vote?slug=${slug}&userId=${userId}`);
        const result = await response.json();
        
        if (result.success) {
          setNetVotes(result.data.netVotes);
          setUpvotes(result.data.upvotes);
          setDownvotes(result.data.downvotes);
          setUserVote(result.data.userVote);
        }
      } catch (error) {
        console.error('Error fetching votes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVotes();
  }, [slug, userId]);

  async function handleVote(action: 'upvote' | 'downvote') {
    if (!userId || isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action, userId }),
      });

      const result = await response.json();

      if (result.success) {
        setNetVotes(result.data.netVotes);
        setUpvotes(result.data.upvotes);
        setDownvotes(result.data.downvotes);
        setUserVote(result.data.userVote);
      } else {
        alert(result.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="voteButton" style={{ opacity: 0.5 }}>
        <span>Loading...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="voteButtonCompact">
        <button
          className={`voteBtn voteBtnUp ${userVote === 'upvote' ? 'active' : ''}`}
          onClick={() => handleVote('upvote')}
          disabled={isVoting}
          title="Upvote"
        >
          ▲
        </button>
        <span className="voteCount">{netVotes > 0 ? '+' : ''}{netVotes}</span>
        <button
          className={`voteBtn voteBtnDown ${userVote === 'downvote' ? 'active' : ''}`}
          onClick={() => handleVote('downvote')}
          disabled={isVoting}
          title="Downvote"
        >
          ▼
        </button>
      </div>
    );
  }

  return (
    <div className="voteButton">
      <div className="voteButtonRow">
        <button
          className={`voteBtn voteBtnUp ${userVote === 'upvote' ? 'active' : ''}`}
          onClick={() => handleVote('upvote')}
          disabled={isVoting}
        >
          <span className="voteIcon">▲</span>
          <span className="voteLabel">Upvote</span>
        </button>
        
        <div className="voteStats">
          <div className="voteNetScore">
            <strong>{netVotes > 0 ? '+' : ''}{netVotes}</strong>
            <span>Net score</span>
          </div>
          <div className="voteBreakdown">
            <span className="voteUp">▲ {upvotes}</span>
            <span className="voteDown">▼ {downvotes}</span>
          </div>
        </div>

        <button
          className={`voteBtn voteBtnDown ${userVote === 'downvote' ? 'active' : ''}`}
          onClick={() => handleVote('downvote')}
          disabled={isVoting}
        >
          <span className="voteIcon">▼</span>
          <span className="voteLabel">Downvote</span>
        </button>
      </div>
      
      {userVote && (
        <p className="voteUserStatus">
          You {userVote === 'upvote' ? 'upvoted' : 'downvoted'} this profile. Click again to remove your vote.
        </p>
      )}
    </div>
  );
}
