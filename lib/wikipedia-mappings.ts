/**
 * Mapping from person slugs to their correct Wikipedia page titles
 * This helps avoid search ambiguity for well-known figures
 */
export const WIKIPEDIA_PAGE_MAPPING: Record<string, string> = {
  'donald-trump': 'Donald Trump',
  'volodymyr-zelenskyy': 'Volodymyr Zelenskyy',
  'ursula-von-der-leyen': 'Ursula von der Leyen',
  'narendra-modi': 'Narendra Modi',
  'jacinda-ardern': 'Jacinda Ardern',
  'xi-jinping': 'Xi Jinping',
  'emmanuel-macron': 'Emmanuel Macron',
  'elon-musk': 'Elon Musk',
};

/**
 * Get the correct Wikipedia page name for a person slug
 */
export function getWikipediaPageName(slug: string, fallbackName: string): string {
  return WIKIPEDIA_PAGE_MAPPING[slug] || fallbackName;
}
