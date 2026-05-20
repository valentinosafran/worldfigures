/**
 * Calculate dynamic opinion label based on live scores
 */

export function calculateLabel(scores: {
  approval: number;
  trust: number;
  impact: number;
  controversy: number;
}): string {
  const { approval, trust, impact, controversy } = scores;

  // Highly polarizing: Very high controversy OR (high impact + high controversy)
  if (controversy >= 75 || (impact >= 90 && controversy >= 60)) {
    return "Highly polarizing";
  }

  // Polarizing: High controversy with medium-high impact
  if (controversy >= 60 && controversy < 75) {
    return "Polarizing";
  }

  // Positive leaning: High approval + low controversy
  if (approval >= 65 && controversy < 40) {
    return "Positive leaning";
  }

  // Mixed to negative: Low approval + high controversy
  if (approval < 45 && controversy >= 65) {
    return "Mixed to negative";
  }

  // Negative: Low approval + low trust
  if (approval < 40 && trust < 40) {
    return "Negative";
  }

  // Mixed: Everything else (medium range)
  return "Mixed";
}

/**
 * Get CSS class for opinion label
 */
export function getOpinionClass(label: string): string {
  const normalized = label.toLowerCase();

  if (normalized.includes("highly polarizing")) return "opinion-high-polarizing";
  if (normalized.includes("polarizing")) return "opinion-polarizing";
  if (normalized.includes("negative")) return "opinion-negative";
  if (normalized.includes("mixed")) return "opinion-mixed";
  if (normalized.includes("positive")) return "opinion-positive";

  return "opinion-neutral";
}
