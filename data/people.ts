export type PersonProfile = {
  slug: string;
  name: string;
  role: string;
  label: string;
  image: string;
  region: string;
  summary: string;
  lastUpdated: string;
  sourceConfidence: number;
  trend7d: number;
  trend30d: number;
  keyTopics: string[];
  strengths: string[];
  risks: string[];
  trendNotes: string[];
  scores: {
    approval: number;
    trust: number;
    impact: number;
    controversy: number;
  };
};

export const people: PersonProfile[] = [
  {
    slug: "volodymyr-zelenskyy",
    name: "Volodymyr Zelenskyy",
    role: "President",
    label: "Positive leaning",
    image: "/images/people/volodymyr-zelenskyy.jpg",
    region: "Ukraine",
    summary:
      "Widely tracked for wartime leadership, international diplomacy, and resilience messaging. Public perception remains split by region and geopolitical stance.",
    lastUpdated: "2026-04-14",
    sourceConfidence: 84,
    trend7d: 2,
    trend30d: 5,
    keyTopics: ["Security", "Diplomacy", "International aid"],
    strengths: [
      "High visibility in global diplomacy",
      "Strong crisis leadership perception",
    ],
    risks: [
      "War fatigue narratives can reduce approval",
      "Polarized geopolitical interpretation",
    ],
    trendNotes: [
      "Improved trust after recent diplomatic engagements",
      "Approval stable in external sentiment tracking",
    ],
    scores: { approval: 69, trust: 63, impact: 91, controversy: 45 },
  },
  {
    slug: "donald-trump",
    name: "Donald Trump",
    role: "Political figure",
    label: "Highly polarizing",
    image: "/images/people/donald-trump.jpg",
    region: "United States",
    summary:
      "One of the most polarizing public figures globally, with strong support and strong opposition reflected across elections, media sentiment, and public polling.",
    lastUpdated: "2026-04-14",
    sourceConfidence: 88,
    trend7d: -1,
    trend30d: 1,
    keyTopics: ["Elections", "Legal coverage", "Economic messaging"],
    strengths: [
      "Very high influence over public discourse",
      "Persistent base support visibility",
    ],
    risks: [
      "Very high controversy score",
      "Sharp reputation swings across demographics",
    ],
    trendNotes: [
      "Sentiment volatility remains high week-to-week",
      "Trust metrics remain below approval metrics",
    ],
    scores: { approval: 49, trust: 42, impact: 94, controversy: 89 },
  },
  {
    slug: "ursula-von-der-leyen",
    name: "Ursula von der Leyen",
    role: "EU leader",
    label: "Mixed",
    image: "/images/people/ursula-von-der-leyen.jpg",
    region: "European Union",
    summary:
      "Perception is shaped by EU-wide policy decisions and bloc-level response to crises, producing mixed but stable sentiment across member states.",
    lastUpdated: "2026-04-14",
    sourceConfidence: 79,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["EU policy", "Trade", "Security cooperation"],
    strengths: [
      "Stable institutional trust profile",
      "Strong policy impact within EU bloc",
    ],
    risks: [
      "Mixed perception across member states",
      "Policy tradeoffs can increase criticism",
    ],
    trendNotes: [
      "Trust improved slightly after policy announcements",
      "Controversy remains moderate and controlled",
    ],
    scores: { approval: 58, trust: 56, impact: 85, controversy: 48 },
  },
  {
    slug: "narendra-modi",
    name: "Narendra Modi",
    role: "Prime Minister",
    label: "Polarizing",
    image: "/images/people/narendra-modi.jpg",
    region: "India",
    summary:
      "Carries high domestic visibility and strong political branding, with perception varying significantly by demographic and policy lens.",
    lastUpdated: "2026-04-14",
    sourceConfidence: 82,
    trend7d: 0,
    trend30d: 3,
    keyTopics: ["Domestic policy", "Growth agenda", "Foreign relations"],
    strengths: [
      "High national influence",
      "Strong impact score across policy narratives",
    ],
    risks: [
      "Polarized reception in social discourse",
      "Controversy elevated during major campaigns",
    ],
    trendNotes: [
      "Approval remains relatively resilient",
      "Controversy rises around headline policy cycles",
    ],
    scores: { approval: 62, trust: 55, impact: 90, controversy: 72 },
  },
  {
    slug: "jacinda-ardern",
    name: "Jacinda Ardern",
    role: "Former Prime Minister",
    label: "Positive leaning",
    image: "/images/people/jacinda-ardern.jpg",
    region: "New Zealand",
    summary:
      "Often associated with empathetic communication and crisis management, resulting in generally favorable international perception trends.",
    lastUpdated: "2026-04-14",
    sourceConfidence: 76,
    trend7d: 1,
    trend30d: 1,
    keyTopics: ["Crisis response", "Public communication", "Leadership style"],
    strengths: [
      "High trust profile",
      "Consistent positive international sentiment",
    ],
    risks: [
      "Lower current policy relevance after office",
      "Impact score can soften over time",
    ],
    trendNotes: [
      "Trust remains a core strength metric",
      "Controversy stays comparatively low",
    ],
    scores: { approval: 71, trust: 68, impact: 79, controversy: 34 },
  },
  {
    slug: "xi-jinping",
    name: "Xi Jinping",
    role: "President",
    label: "Mixed to negative",
    image: "/images/people/xi-jinping.jpg",
    region: "China",
    summary:
      "Perception is highly dependent on international relations, economic narrative, and domestic governance framing, with mixed-to-negative external sentiment.",
    lastUpdated: "2026-04-14",
    sourceConfidence: 81,
    trend7d: -1,
    trend30d: -2,
    keyTopics: ["Geopolitics", "Economy", "State governance"],
    strengths: [
      "Very high impact on global policy conversation",
      "Strong institutional control narrative",
    ],
    risks: [
      "Low external trust sentiment",
      "High controversy in international media",
    ],
    trendNotes: [
      "External sentiment softened in recent weeks",
      "Impact remains structurally high despite criticism",
    ],
    scores: { approval: 44, trust: 40, impact: 95, controversy: 78 },
  },
  {
    slug: "emmanuel-macron",
    name: "Emmanuel Macron",
    role: "President",
    label: "Mixed",
    image: "/images/people/emmanuel-macron.jpg",
    region: "France",
    summary:
      "Public perception fluctuates with reform agenda, protest cycles, and foreign policy positioning, typically remaining in mixed territory.",
    lastUpdated: "2026-04-14",
    sourceConfidence: 78,
    trend7d: 0,
    trend30d: 1,
    keyTopics: ["Reforms", "Foreign policy", "Domestic protests"],
    strengths: [
      "High international policy visibility",
      "Impact remains above trust baseline",
    ],
    risks: [
      "Mixed domestic approval",
      "Policy reforms can drive controversy spikes",
    ],
    trendNotes: [
      "Approval and trust remain in mixed band",
      "Controversy is moderate but persistent",
    ],
    scores: { approval: 57, trust: 51, impact: 83, controversy: 59 },
  },
  {
    slug: "elon-musk",
    name: "Elon Musk",
    role: "Business figure",
    label: "Highly polarizing",
    image: "/images/people/elon-musk.jpg",
    region: "Global",
    summary:
      "Major influence across technology, business, and social platforms, with rapid opinion swings and strong polarization in public discourse.",
    lastUpdated: "2026-04-14",
    sourceConfidence: 86,
    trend7d: -2,
    trend30d: 0,
    keyTopics: ["Technology", "Business strategy", "Platform speech"],
    strengths: [
      "Extremely high influence and reach",
      "Strong impact across multiple sectors",
    ],
    risks: [
      "High controversy baseline",
      "Fast-moving sentiment swings",
    ],
    trendNotes: [
      "Short-term sentiment softened this week",
      "Impact remains near top of tracked figures",
    ],
    scores: { approval: 50, trust: 46, impact: 96, controversy: 86 },
  },
];

export function getOpinionClass(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("highly polarizing")) return "opinion-high-polarizing";
  if (normalized.includes("polarizing")) return "opinion-polarizing";
  if (normalized.includes("negative")) return "opinion-negative";
  if (normalized.includes("mixed")) return "opinion-mixed";
  if (normalized.includes("positive")) return "opinion-positive";

  return "opinion-neutral";
}

function normalizeSlug(slug: string) {
  return decodeURIComponent(slug).trim().toLowerCase();
}

const slugAliases: Record<string, string> = {
  "volodymyr-zelnskyy": "volodymyr-zelenskyy",
  "volodmyr-zelenskyy": "volodymyr-zelenskyy",
  "ursula-von-der-leyen": "ursula-von-der-leyen",
};

export function getPersonBySlug(slug?: string) {
  if (!slug) return undefined;

  const normalized = normalizeSlug(slug);
  const resolved = slugAliases[normalized] ?? normalized;
  return people.find((person) => person.slug === resolved);
}
