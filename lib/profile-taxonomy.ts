import { PersonProfile } from '../data/people';

export type CategoryKey =
  | 'technology-ai'
  | 'politics-geopolitics'
  | 'finance-business'
  | 'media-culture'
  | 'science-thought'
  | 'eu-leaders'
  | 'other';

export const CATEGORY_DEFINITIONS: Array<{
  key: CategoryKey;
  name: string;
  description: string;
  icon: string;
}> = [
  {
    key: 'technology-ai',
    name: 'Technology & AI',
    description: 'Tech CEOs, AI researchers, and innovation leaders shaping the future',
    icon: '🤖',
  },
  {
    key: 'politics-geopolitics',
    name: 'Politics & Geopolitics',
    description: 'Presidents, prime ministers, and world leaders',
    icon: '🌍',
  },
  {
    key: 'finance-business',
    name: 'Finance & Business',
    description: 'CEOs, investors, and business leaders driving markets',
    icon: '💼',
  },
  {
    key: 'media-culture',
    name: 'Media & Culture',
    description: 'Musicians, creators, athletes, and cultural icons',
    icon: '🎭',
  },
  {
    key: 'science-thought',
    name: 'Science & Thought Leaders',
    description: 'Scientists, historians, and intellectual influencers',
    icon: '🔬',
  },
  {
    key: 'eu-leaders',
    name: 'EU Leaders',
    description: 'European Union officials and representatives',
    icon: '🇪🇺',
  },
];

const roleOverrides: Record<string, string> = {
  'donald-trump': 'President',
  'joe-biden': 'Former President',
  'kamala-harris': 'President',
  'ursula-von-der-leyen': 'President of the European Commission',
};

export function getDisplayRole(person: PersonProfile): string {
  return roleOverrides[person.slug] || person.role;
}

export function getCategoryKey(person: PersonProfile): CategoryKey {
  if (person.slug === 'ursula-von-der-leyen') {
    return 'eu-leaders';
  }

  const role = getDisplayRole(person).toLowerCase();

  if (
    role.includes('president') ||
    role.includes('prime minister') ||
    role.includes('crown prince') ||
    role.includes('vice president') ||
    role.includes('political') ||
    role.includes('chancellor')
  ) {
    return 'politics-geopolitics';
  }

  if (
    role.includes('tech') ||
    role.includes('ai')
  ) {
    return 'technology-ai';
  }

  if (
    role.includes('finance') ||
    role.includes('bank') ||
    role.includes('investor') ||
    role.includes('business') ||
    (role.includes('ceo') && !role.includes('tech') && !role.includes('ai'))
  ) {
    return 'finance-business';
  }

  if (
    role.includes('musician') ||
    role.includes('podcaster') ||
    role.includes('content creator') ||
    role.includes('athlete') ||
    role.includes('media')
  ) {
    return 'media-culture';
  }

  if (
    role.includes('scientist') ||
    role.includes('historian') ||
    role.includes('researcher')
  ) {
    return 'science-thought';
  }

  return 'other';
}

export function getCategoryName(key: CategoryKey): string {
  const found = CATEGORY_DEFINITIONS.find((category) => category.key === key);
  return found ? found.name : 'Other';
}
