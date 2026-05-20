/**
 * Calculate signal score (how "newsworthy" or "active" a person is)
 */
export function calculateSignalScore(
  scores: {
    approval: number;
    trust: number;
    impact: number;
    controversy: number;
  },
  confidence: number,
  recentMovement?: {
    approval: number;
    trust: number;
    impact: number;
    controversy: number;
  }
): number {
  // Base signal on impact (visibility) and controversy (discussion volume)
  const baseSignal = scores.impact * 0.45 + scores.controversy * 0.15;
  
  // Add confidence factor (more confident data = stronger signal)
  const confidenceBonus = confidence * 0.15;
  
  // Add movement factor (bigger changes = stronger signal)
  let movementBonus = 0;
  if (recentMovement) {
    const totalMovement = 
      Math.abs(recentMovement.approval) +
      Math.abs(recentMovement.trust) +
      Math.abs(recentMovement.impact) +
      Math.abs(recentMovement.controversy);
    
    movementBonus = Math.min(totalMovement * 2, 25); // Cap at 25 points
  }
  
  return Math.round(baseSignal + confidenceBonus + movementBonus);
}

/**
 * Calculate movement between two score snapshots
 */
export function calculateMovement(
  current: {
    approval: { score: number };
    trust: { score: number };
    impact: { score: number };
    controversy: { score: number };
  },
  previous: {
    approval: { score: number };
    trust: { score: number };
    impact: { score: number };
    controversy: { score: number };
  } | null
): {
  approval: number;
  trust: number;
  impact: number;
  controversy: number;
} | null {
  if (!previous) {
    return null;
  }

  return {
    approval: current.approval.score - previous.approval.score,
    trust: current.trust.score - previous.trust.score,
    impact: current.impact.score - previous.impact.score,
    controversy: current.controversy.score - previous.controversy.score,
  };
}
