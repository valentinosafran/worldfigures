'use client';

import { useState, useEffect } from 'react';
import { people } from '../data/people';
import { getOpinionClass } from '../lib/label-calculator';
import { InlineVoteDisplay } from './inline-vote-display';

interface ProfileVotes {
  slug: string;
  netVotes: number;
  upvotes: number;
  downvotes: number;
}

export function CommunityRankingsClient() {
  const [rankings, setRankings] = useState<ProfileVotes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'net' | 'upvotes' | 'controversial'>('net');

  useEffect(() => {
    async function fetchAllVotes() {
      try {
        const votePromises = people.map(person =>
          fetch(`/api/vote?slug=${person.slug}`)
            .then(res => res.json())
            .then(result => ({
              slug: person.slug,
              netVotes: result.success ? result.data.netVotes : 0,
              upvotes: result.success ? result.data.upvotes : 0,
              downvotes: result.success ? result.data.downvotes : 0,
            }))
            .catch(() => ({
              slug: person.slug,
              netVotes: 0,
              upvotes: 0,
              downvotes: 0,
            }))
        );

        const results = await Promise.all(votePromises);
        setRankings(results);
      } catch (error) {
        console.error('Error fetching votes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllVotes();
  }, []);

  const getSortedRankings = () => {
    const rankedPeople = people.map(person => {
      const votes = rankings.find(r => r.slug === person.slug) || {
        netVotes: 0,
        upvotes: 0,
        downvotes: 0,
      };
      return { ...person, ...votes };
    });

    switch (sortBy) {
      case 'upvotes':
        return rankedPeople.sort((a, b) => b.upvotes - a.upvotes);
      case 'controversial':
        // Most controversial = highest total votes (up + down) with close split
        return rankedPeople.sort((a, b) => {
          const aTotal = a.upvotes + a.downvotes;
          const bTotal = b.upvotes + b.downvotes;
          const aControversy = aTotal * (1 - Math.abs(a.upvotes - a.downvotes) / Math.max(aTotal, 1));
          const bControversy = bTotal * (1 - Math.abs(b.upvotes - b.downvotes) / Math.max(bTotal, 1));
          return bControversy - aControversy;
        });
      default: // 'net'
        return rankedPeople.sort((a, b) => b.netVotes - a.netVotes);
    }
  };

  const sortedRankings = getSortedRankings();

  const totalVotes = rankings.reduce((sum, r) => sum + r.upvotes + r.downvotes, 0);
  const totalUpvotes = rankings.reduce((sum, r) => sum + r.upvotes, 0);
  const totalDownvotes = rankings.reduce((sum, r) => sum + r.downvotes, 0);
  const mostVoted = [...sortedRankings].sort((a, b) => 
    (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes)
  )[0];

  return (
    <section className="section" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="sectionHeading" style={{ maxWidth: '900px', margin: '0 auto 40px' }}>
          <span style={{ color: 'var(--accent)' }}>Community Voice</span>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', margin: '16px 0' }}>
            Community Rankings
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', color: 'var(--muted)', lineHeight: '1.7' }}>
            Vote for profiles you think deserve more attention. Your votes help shape the community's view 
            of public figures. Rankings update in real-time as people vote.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="dashboardStats" style={{ marginBottom: '40px' }}>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Total votes</span>
            <strong>{isLoading ? '...' : totalVotes.toLocaleString()}</strong>
            <p>Community participation across all profiles</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Upvotes</span>
            <strong style={{ color: '#4ade80' }}>{isLoading ? '...' : totalUpvotes.toLocaleString()}</strong>
            <p>Positive community sentiment</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Downvotes</span>
            <strong style={{ color: '#f87171' }}>{isLoading ? '...' : totalDownvotes.toLocaleString()}</strong>
            <p>Critical community sentiment</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Most voted</span>
            <strong>{isLoading ? '...' : mostVoted?.name.split(' ')[0]}</strong>
            <p>{isLoading ? 'Loading...' : `${(mostVoted?.upvotes || 0) + (mostVoted?.downvotes || 0)} total votes`}</p>
          </article>
        </div>

        {/* Sort Options */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            className={`button ${sortBy === 'net' ? 'buttonPrimary' : 'buttonSecondary'}`}
            onClick={() => setSortBy('net')}
            style={{ minWidth: '140px' }}
          >
            📊 Net Score
          </button>
          <button
            className={`button ${sortBy === 'upvotes' ? 'buttonPrimary' : 'buttonSecondary'}`}
            onClick={() => setSortBy('upvotes')}
            style={{ minWidth: '140px' }}
          >
            ⬆️ Most Upvoted
          </button>
          <button
            className={`button ${sortBy === 'controversial' ? 'buttonPrimary' : 'buttonSecondary'}`}
            onClick={() => setSortBy('controversial')}
            style={{ minWidth: '140px' }}
          >
            🔥 Controversial
          </button>
        </div>

        {/* Rankings List */}
        <div className="dashboardBoard profileCard">
          <div className="dashboardBoardHeader">
            <div>
              <span className="sectionKicker">Community powered</span>
              <h3>Vote Rankings</h3>
            </div>
            <p>
              {sortBy === 'net' && 'Ranked by net score (upvotes minus downvotes)'}
              {sortBy === 'upvotes' && 'Ranked by total upvotes received'}
              {sortBy === 'controversial' && 'Profiles with most divided opinions'}
            </p>
          </div>

          <div className="dashboardTable">
            <div className="dashboardRow dashboardRowHead">
              <span>#</span>
              <span>Profile</span>
              <span>Region</span>
              <span>Net Score</span>
              <span>Upvotes</span>
              <span>Downvotes</span>
              <span>Total Votes</span>
              <span>Action</span>
            </div>

            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
                Loading community rankings...
              </div>
            ) : (
              sortedRankings.map((person, index) => (
                <div className="dashboardRow dashboardRowLink" key={person.slug} style={{ cursor: 'default' }}>
                  <span data-label="#" className="dashboardNumericCell dashboardRankCell">{index + 1}</span>
                  <span data-label="Profile" className="dashboardNameCell">
                    <img className="dashboardTableAvatar" src={person.image} alt={person.name} />
                    <span className="dashboardFigureText">
                      <strong>{person.name}</strong>
                      <small>{person.role}</small>
                      <span className={`dashboardInlineStatus ${getOpinionClass(person.label)}`}>
                        {person.label}
                        <InlineVoteDisplay slug={person.slug} />
                      </span>
                    </span>
                  </span>
                  <span data-label="Region" className="dashboardRegionCell">{person.region}</span>
                  <span 
                    data-label="Net Score" 
                    className="dashboardNumericCell"
                    style={{ 
                      fontWeight: 600,
                      color: person.netVotes > 0 ? '#4ade80' : person.netVotes < 0 ? '#f87171' : 'inherit'
                    }}
                  >
                    {person.netVotes > 0 ? '+' : ''}{person.netVotes}
                  </span>
                  <span data-label="Upvotes" className="dashboardNumericCell" style={{ color: '#4ade80' }}>
                    ▲ {person.upvotes}
                  </span>
                  <span data-label="Downvotes" className="dashboardNumericCell" style={{ color: '#f87171' }}>
                    ▼ {person.downvotes}
                  </span>
                  <span data-label="Total" className="dashboardNumericCell">
                    {person.upvotes + person.downvotes}
                  </span>
                  <span data-label="Action" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <a 
                      href={`/profile/${person.slug}`}
                      className="button buttonSecondary"
                      style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                    >
                      View Profile
                    </a>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="infoCard" style={{ marginTop: '40px', padding: '24px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '1.2rem' }}>How Voting Works</h3>
          <ul style={{ color: 'var(--muted)', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li><strong>Upvote (▲)</strong> profiles you think deserve more attention or recognition</li>
            <li><strong>Downvote (▼)</strong> profiles you think are overrated or deserve less attention</li>
            <li>Click your vote again to remove it</li>
            <li>You can switch between upvote and downvote</li>
            <li>All votes are anonymous and tracked by your browser</li>
            <li>Rankings update in real-time as the community votes</li>
            <li>Net Score = Upvotes - Downvotes</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
