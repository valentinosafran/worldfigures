/**
 * Mapping from person slugs to their correct Wikipedia page titles
 * This helps avoid search ambiguity for well-known figures
 * Complete mapping for all 42 profiles
 */
export const WIKIPEDIA_PAGE_MAPPING: Record<string, string> = {
  // Original 8
  'donald-trump': 'Donald Trump',
  'volodymyr-zelenskyy': 'Volodymyr Zelenskyy',
  'ursula-von-der-leyen': 'Ursula von der Leyen',
  'narendra-modi': 'Narendra Modi',
  'jacinda-ardern': 'Jacinda Ardern',
  'xi-jinping': 'Xi Jinping',
  'emmanuel-macron': 'Emmanuel Macron',
  'elon-musk': 'Elon Musk',
  
  // Tech & AI (11 total)
  'sam-altman': 'Sam Altman',
  'jensen-huang': 'Jensen Huang',
  'mark-zuckerberg': 'Mark Zuckerberg',
  'sundar-pichai': 'Sundar Pichai',
  'satya-nadella': 'Satya Nadella',
  'demis-hassabis': 'Demis Hassabis',
  'lisa-su': 'Lisa Su',
  'geoffrey-hinton': 'Geoffrey Hinton',
  'tim-cook': 'Tim Cook',
  'dario-amodei': 'Dario Amodei',
  'yann-lecun': 'Yann LeCun',
  
  // Politics (15 total including above)
  'vladimir-putin': 'Vladimir Putin',
  'joe-biden': 'Joe Biden',
  'benjamin-netanyahu': 'Benjamin Netanyahu',
  'mohammed-bin-salman': 'Mohammed bin Salman',
  'keir-starmer': 'Keir Starmer',
  'kamala-harris': 'Kamala Harris',
  'giorgia-meloni': 'Giorgia Meloni',
  'recep-tayyip-erdogan': 'Recep Tayyip Erdoğan',
  
  // Finance (6 total)
  'larry-fink': 'Larry Fink',
  'warren-buffett': 'Warren Buffett',
  'jamie-dimon': 'Jamie Dimon',
  'jeff-bezos': 'Jeff Bezos',
  'bill-gates': 'Bill Gates',
  'bernard-arnault': 'Bernard Arnault',
  
  // Media & Culture (6 total)
  'taylor-swift': 'Taylor Swift',
  'joe-rogan': 'Joe Rogan',
  'mrbeast': 'MrBeast',
  'cristiano-ronaldo': 'Cristiano Ronaldo',
  'oprah-winfrey': 'Oprah Winfrey',
  'lebron-james': 'LeBron James',
  
  // Science (4 total)
  'yuval-noah-harari': 'Yuval Noah Harari',
  'peter-thiel': 'Peter Thiel',
  'jennifer-doudna': 'Jennifer Doudna',
};

/**
 * Get the correct Wikipedia page name for a person slug
 */
export function getWikipediaPageName(slug: string, fallbackName: string): string {
  return WIKIPEDIA_PAGE_MAPPING[slug] || fallbackName;
}
