/**
 * Calculate signal score (how "newsworthy" or "active" a person is)
 * 
 * Formula emphasizes the key differentiating factors:
 * - Impact: Media visibility and influence (65%) - primary driver
 * - Controversy: Public dispute level, polarization (30%) - amplifies signal
 * - Confidence: Data quality factor (5%)
 * - Movement: Recent score changes (up to 12 bonus points)
 * 
 * This creates meaningful differentiation:
 * - Very high impact (90+) + controversy (10+) = 70-80 range
 * - High impact (70-89) + moderate controversy = 55-70 range
 * - Medium impact (50-69) = 40-55 range
 * - Low impact (<50) = <40 range
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
  // Impact: Primary driver of signal (65%)
  const impactFactor = scores.impact * 0.65;
  
  // Controversy: Amplifies signal through polarization (30%)
  const controversyFactor = scores.controversy * 0.30;
  
  // Confidence factor: Data quality (5%)
  const confidenceFactor = confidence * 0.05;
  
  // Movement factor: Recent changes increase signal (up to 12 bonus points)
  let movementBonus = 0;
  if (recentMovement) {
    const totalMovement = 
      Math.abs(recentMovement.approval) +
      Math.abs(recentMovement.trust) +
      Math.abs(recentMovement.impact) +
      Math.abs(recentMovement.controversy);
    
    movementBonus = Math.min(totalMovement * 1.2, 12); // Cap at 12 points
  }
  
  const baseSignal = impactFactor + controversyFactor + confidenceFactor;
  
  return Math.round(baseSignal + movementBonus);
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
