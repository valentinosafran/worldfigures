'use client';

import { VoteButton } from './vote-button';

interface ProfileVotingProps {
  slug: string;
}

export function ProfileVoting({ slug }: ProfileVotingProps) {
  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Community Vote</h3>
      <VoteButton slug={slug} />
    </div>
  );
}
