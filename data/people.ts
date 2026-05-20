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
    role: "Tech CEO",
    label: "Highly polarizing",
    image: "/images/people/elon-musk.jpg",
    region: "Global",
    summary:
      "Major influence across technology, business, and social platforms, with rapid opinion swings and strong polarization in public discourse.",
    lastUpdated: "2026-05-20",
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
  // Technology & AI Leaders
  {
    slug: "sam-altman",
    name: "Sam Altman",
    role: "AI CEO",
    label: "Mixed to positive",
    image: "/images/people/sam-altman.jpg",
    region: "United States",
    summary:
      "Leading the AI revolution through OpenAI, with growing influence over technology policy, ethics debates, and global AI development standards.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 88,
    trend7d: 3,
    trend30d: 8,
    keyTopics: ["AI development", "Tech policy", "AGI safety"],
    strengths: [
      "Central figure in AI advancement",
      "High trust in tech community",
    ],
    risks: [
      "Growing regulatory scrutiny",
      "Competition from other AI labs",
    ],
    trendNotes: [
      "GPT-5 announcements driving positive sentiment",
      "Policy influence expanding globally",
    ],
    scores: { approval: 68, trust: 64, impact: 94, controversy: 52 },
  },
  {
    slug: "jensen-huang",
    name: "Jensen Huang",
    role: "Tech CEO",
    label: "Positive",
    image: "/images/people/jensen-huang.jpg",
    region: "United States",
    summary:
      "NVIDIA's CEO has become synonymous with AI hardware revolution, driving unprecedented growth and establishing dominance in GPU computing infrastructure.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 85,
    trend7d: 2,
    trend30d: 5,
    keyTopics: ["AI hardware", "GPU computing", "Tech innovation"],
    strengths: [
      "Market leadership in AI chips",
      "Strong business execution",
    ],
    risks: [
      "Supply chain dependencies",
      "Increasing competition from AMD and startups",
    ],
    trendNotes: [
      "Stock performance driving positive coverage",
      "New product launches well received",
    ],
    scores: { approval: 72, trust: 70, impact: 89, controversy: 28 },
  },
  {
    slug: "mark-zuckerberg",
    name: "Mark Zuckerberg",
    role: "Tech CEO",
    label: "Polarizing",
    image: "/images/people/mark-zuckerberg.jpg",
    region: "United States",
    summary:
      "Meta's pivot to AI and continued metaverse investments keep him at the center of tech discourse, with mixed public perception around privacy and platform responsibility.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 87,
    trend7d: 1,
    trend30d: 3,
    keyTopics: ["Social media", "AI research", "Metaverse"],
    strengths: [
      "Massive platform influence",
      "Strong AI research division",
    ],
    risks: [
      "Privacy concerns persist",
      "Platform moderation controversies",
    ],
    trendNotes: [
      "Llama 4 release improved sentiment",
      "Regulatory challenges ongoing",
    ],
    scores: { approval: 48, trust: 44, impact: 92, controversy: 74 },
  },
  {
    slug: "sundar-pichai",
    name: "Sundar Pichai",
    role: "Tech CEO",
    label: "Mixed",
    image: "/images/people/sundar-pichai.jpg",
    region: "United States",
    summary:
      "Google's CEO navigates antitrust challenges while leading one of the world's most influential AI research organizations and search infrastructure.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 83,
    trend7d: 0,
    trend30d: 2,
    keyTopics: ["Search", "AI", "Antitrust"],
    strengths: [
      "Controls critical internet infrastructure",
      "Leading AI research capabilities",
    ],
    risks: [
      "Antitrust litigation ongoing",
      "Competition from OpenAI in search",
    ],
    trendNotes: [
      "Gemini updates receive mixed reactions",
      "Regulatory pressures mounting",
    ],
    scores: { approval: 56, trust: 52, impact: 88, controversy: 58 },
  },
  {
    slug: "satya-nadella",
    name: "Satya Nadella",
    role: "Tech CEO",
    label: "Positive",
    image: "/images/people/satya-nadella.jpg",
    region: "United States",
    summary:
      "Transformed Microsoft into an AI powerhouse through OpenAI partnership, cloud dominance, and enterprise AI integration, earning widespread business respect.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 86,
    trend7d: 2,
    trend30d: 4,
    keyTopics: ["Cloud computing", "Enterprise AI", "Developer tools"],
    strengths: [
      "Strong execution on AI strategy",
      "High trust in enterprise market",
    ],
    risks: [
      "OpenAI dependence creates risk",
      "Antitrust scrutiny increasing",
    ],
    trendNotes: [
      "Copilot adoption driving growth",
      "Azure AI services expanding rapidly",
    ],
    scores: { approval: 74, trust: 72, impact: 87, controversy: 32 },
  },
  {
    slug: "demis-hassabis",
    name: "Demis Hassabis",
    role: "AI Researcher",
    label: "Positive",
    image: "/images/people/demis-hassabis.jpg",
    region: "United Kingdom",
    summary:
      "Google DeepMind CEO and neuroscience pioneer leading breakthrough AI research, from AlphaFold protein folding to Gemini language models.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 81,
    trend7d: 1,
    trend30d: 3,
    keyTopics: ["AI research", "Scientific AI", "AGI development"],
    strengths: [
      "Nobel-level scientific achievements",
      "Strong academic credibility",
    ],
    risks: [
      "Commercial pressure from Google",
      "AGI safety concerns",
    ],
    trendNotes: [
      "Recent research papers highly cited",
      "Influence growing in policy circles",
    ],
    scores: { approval: 76, trust: 74, impact: 82, controversy: 24 },
  },
  {
    slug: "lisa-su",
    name: "Lisa Su",
    role: "Tech CEO",
    label: "Positive",
    image: "/images/people/lisa-su.jpg",
    region: "United States",
    summary:
      "AMD's CEO orchestrating a semiconductor renaissance, challenging NVIDIA in AI chips while maintaining CPU competitiveness against Intel.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 79,
    trend7d: 1,
    trend30d: 4,
    keyTopics: ["Semiconductors", "AI chips", "Tech competition"],
    strengths: [
      "Successful turnaround of AMD",
      "Strong engineering leadership",
    ],
    risks: [
      "NVIDIA dominance hard to overcome",
      "Competitive market pressures",
    ],
    trendNotes: [
      "New MI300 chips gaining traction",
      "Market share growing steadily",
    ],
    scores: { approval: 70, trust: 68, impact: 76, controversy: 18 },
  },
  {
    slug: "geoffrey-hinton",
    name: "Geoffrey Hinton",
    role: "AI Researcher",
    label: "Positive",
    image: "/images/people/geoffrey-hinton.jpg",
    region: "Canada",
    summary:
      "Godfather of deep learning now warning about AI risks after leaving Google, commanding attention from policymakers and researchers worldwide.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 84,
    trend7d: 2,
    trend30d: 5,
    keyTopics: ["AI safety", "Neural networks", "Tech ethics"],
    strengths: [
      "Foundational AI contributions",
      "Moral authority on AI risks",
    ],
    risks: [
      "Predictions seen as alarmist by some",
      "Limited current research involvement",
    ],
    trendNotes: [
      "Safety warnings increasingly heeded",
      "Nobel Prize speculation continues",
    ],
    scores: { approval: 78, trust: 80, impact: 79, controversy: 36 },
  },
  // Politics & Geopolitics (Additional)
  {
    slug: "vladimir-putin",
    name: "Vladimir Putin",
    role: "President",
    label: "Negative to polarizing",
    image: "/images/people/vladimir-putin.jpg",
    region: "Russia",
    summary:
      "Dominates geopolitical discourse through military actions, energy politics, and strategic alliances, with deeply divided international perception.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 89,
    trend7d: -1,
    trend30d: -2,
    keyTopics: ["Geopolitics", "Military strategy", "Energy"],
    strengths: [
      "Massive geopolitical impact",
      "Strong domestic control narrative",
    ],
    risks: [
      "International isolation deepening",
      "Economic sanctions effects",
    ],
    trendNotes: [
      "Conflict dynamics shifting sentiment",
      "Diplomatic efforts yield mixed results",
    ],
    scores: { approval: 32, trust: 28, impact: 97, controversy: 94 },
  },
  {
    slug: "joe-biden",
    name: "Joe Biden",
    role: "President",
    label: "Mixed to polarizing",
    image: "/images/people/joe-biden.jpg",
    region: "United States",
    summary:
      "Navigating domestic policy challenges, international crises, and age concerns while maintaining institutional relationships and NATO leadership.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 85,
    trend7d: 0,
    trend30d: -1,
    keyTopics: ["Domestic policy", "Foreign relations", "Economy"],
    strengths: [
      "Strong institutional support",
      "International alliance management",
    ],
    risks: [
      "Age and capability questions",
      "Polarized domestic approval",
    ],
    trendNotes: [
      "Economic data creating mixed sentiment",
      "Foreign policy generally supported",
    ],
    scores: { approval: 52, trust: 48, impact: 91, controversy: 68 },
  },
  {
    slug: "benjamin-netanyahu",
    name: "Benjamin Netanyahu",
    role: "Prime Minister",
    label: "Highly polarizing",
    image: "/images/people/benjamin-netanyahu.jpg",
    region: "Israel",
    summary:
      "Longest-serving Israeli PM navigating security crises, judicial reform controversies, and shifting international support amid conflict escalation.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 87,
    trend7d: -2,
    trend30d: -4,
    keyTopics: ["Security", "Regional conflicts", "Legal challenges"],
    strengths: [
      "Long-term political survival",
      "Strong security credibility domestically",
    ],
    risks: [
      "International criticism mounting",
      "Domestic protests ongoing",
    ],
    trendNotes: [
      "Conflict coverage affecting perception",
      "Legal proceedings continue",
    ],
    scores: { approval: 42, trust: 38, impact: 88, controversy: 88 },
  },
  {
    slug: "mohammed-bin-salman",
    name: "Mohammed bin Salman",
    role: "Crown Prince",
    label: "Polarizing",
    image: "/images/people/mohammed-bin-salman.jpg",
    region: "Saudi Arabia",
    summary:
      "Transforming Saudi Arabia through Vision 2030 reforms while navigating human rights controversies and regional power dynamics.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 80,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["Economic reform", "Regional diplomacy", "Human rights"],
    strengths: [
      "Massive economic transformation",
      "Growing regional influence",
    ],
    risks: [
      "Human rights concerns persistent",
      "Reform pace creating tensions",
    ],
    trendNotes: [
      "NEOM projects gaining attention",
      "Diplomatic normalization progress",
    ],
    scores: { approval: 46, trust: 42, impact: 84, controversy: 82 },
  },
  {
    slug: "keir-starmer",
    name: "Keir Starmer",
    role: "Prime Minister",
    label: "Mixed",
    image: "/images/people/keir-starmer.jpg",
    region: "United Kingdom",
    summary:
      "Labour's return to power brings focus on economic stability, NHS reform, and post-Brexit adjustments with cautious optimism from voters.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 77,
    trend7d: 1,
    trend30d: 3,
    keyTopics: ["Economic policy", "Healthcare", "UK-EU relations"],
    strengths: [
      "Fresh mandate from voters",
      "Pragmatic policy approach",
    ],
    risks: [
      "High expectations to manage",
      "Economic challenges inherited",
    ],
    trendNotes: [
      "Honeymoon period still ongoing",
      "Policy implementation watched closely",
    ],
    scores: { approval: 62, trust: 58, impact: 72, controversy: 38 },
  },
  // Finance & Business
  {
    slug: "larry-fink",
    name: "Larry Fink",
    role: "Finance CEO",
    label: "Mixed to polarizing",
    image: "/images/people/larry-fink.jpg",
    region: "United States",
    summary:
      "BlackRock CEO wields enormous influence over global capital allocation, ESG investing trends, and corporate governance standards.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 82,
    trend7d: 0,
    trend30d: 1,
    keyTopics: ["Asset management", "ESG", "Corporate governance"],
    strengths: [
      "Controls $10+ trillion in assets",
      "Major influence on corporate behavior",
    ],
    risks: [
      "ESG backlash from conservatives",
      "Concentration of power concerns",
    ],
    trendNotes: [
      "Quarterly letters still move markets",
      "Political scrutiny increasing",
    ],
    scores: { approval: 54, trust: 52, impact: 86, controversy: 64 },
  },
  {
    slug: "warren-buffett",
    name: "Warren Buffett",
    role: "Investor",
    label: "Positive",
    image: "/images/people/warren-buffett.jpg",
    region: "United States",
    summary:
      "Oracle of Omaha maintains legendary status through Berkshire Hathaway leadership, with investors hanging on his market commentary and annual letters.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 84,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["Value investing", "Market wisdom", "Philanthropy"],
    strengths: [
      "Unmatched investing track record",
      "High trust and credibility",
    ],
    risks: [
      "Age and succession concerns",
      "Berkshire performance questions",
    ],
    trendNotes: [
      "Annual meeting still draws crowds",
      "Market calls widely followed",
    ],
    scores: { approval: 76, trust: 78, impact: 81, controversy: 22 },
  },
  {
    slug: "jamie-dimon",
    name: "Jamie Dimon",
    role: "Bank CEO",
    label: "Mixed",
    image: "/images/people/jamie-dimon.jpg",
    region: "United States",
    summary:
      "JPMorgan Chase CEO serves as Wall Street's leading voice on economy, regulation, and banking industry health through market cycles.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 81,
    trend7d: 0,
    trend30d: 1,
    keyTopics: ["Banking", "Economy", "Regulation"],
    strengths: [
      "Strong crisis management",
      "Respected economic commentator",
    ],
    risks: [
      "Banking sector controversies",
      "Regulatory scrutiny ongoing",
    ],
    trendNotes: [
      "Economic warnings taken seriously",
      "Bank performance remains strong",
    ],
    scores: { approval: 58, trust: 56, impact: 78, controversy: 48 },
  },
  {
    slug: "jeff-bezos",
    name: "Jeff Bezos",
    role: "Business figure",
    label: "Polarizing",
    image: "/images/people/jeff-bezos.jpg",
    region: "United States",
    summary:
      "Amazon founder's focus shifts to Blue Origin space ventures and Washington Post ownership while maintaining massive business influence.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 83,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["Space exploration", "Media ownership", "Philanthropy"],
    strengths: [
      "Massive wealth and resources",
      "Long-term vision for space",
    ],
    risks: [
      "Labor practice criticisms",
      "Wealth inequality symbol",
    ],
    trendNotes: [
      "Blue Origin launches gaining attention",
      "Washington Post editorial independence debated",
    ],
    scores: { approval: 48, trust: 44, impact: 84, controversy: 72 },
  },
  // Media, Culture & Internet
  {
    slug: "taylor-swift",
    name: "Taylor Swift",
    role: "Musician",
    label: "Positive",
    image: "/images/people/taylor-swift.jpg",
    region: "United States",
    summary:
      "Cultural phenomenon driving massive economic impact through tours, re-recordings campaign, and unparalleled fan engagement across generations.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 92,
    trend7d: 3,
    trend30d: 6,
    keyTopics: ["Music", "Cultural influence", "Business model"],
    strengths: [
      "Unprecedented tour revenues",
      "Massive devoted fanbase",
    ],
    risks: [
      "Overexposure concerns",
      "Political engagement scrutiny",
    ],
    trendNotes: [
      "Eras Tour economic impact continues",
      "Re-recording strategy successful",
    ],
    scores: { approval: 82, trust: 76, impact: 88, controversy: 34 },
  },
  {
    slug: "joe-rogan",
    name: "Joe Rogan",
    role: "Podcaster",
    label: "Polarizing",
    image: "/images/people/joe-rogan.jpg",
    region: "United States",
    summary:
      "Commands largest podcast audience globally, shaping political discourse and cultural conversations through long-form interviews with controversial figures.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 86,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["Podcasting", "Free speech", "Cultural commentary"],
    strengths: [
      "Massive reach and influence",
      "Authentic conversational style",
    ],
    risks: [
      "Misinformation controversies",
      "Platform responsibility debates",
    ],
    trendNotes: [
      "Spotify deal continues to pay off",
      "Guest selection draws scrutiny",
    ],
    scores: { approval: 54, trust: 48, impact: 86, controversy: 76 },
  },
  {
    slug: "mrbeast",
    name: "MrBeast",
    role: "Content Creator",
    label: "Positive to mixed",
    image: "/images/people/mrbeast.jpg",
    region: "United States",
    summary:
      "YouTube's biggest star revolutionizing content creation through massive giveaways, production values, and philanthropic stunts reaching hundreds of millions.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 88,
    trend7d: 2,
    trend30d: 4,
    keyTopics: ["Content creation", "Philanthropy", "Business ventures"],
    strengths: [
      "Highest YouTube subscriber count",
      "Innovative content strategies",
    ],
    risks: [
      "Sustainability questions",
      "Philanthropy critics emerging",
    ],
    trendNotes: [
      "Beast Burger expansion ongoing",
      "Production scale keeps growing",
    ],
    scores: { approval: 72, trust: 66, impact: 79, controversy: 42 },
  },
  {
    slug: "cristiano-ronaldo",
    name: "Cristiano Ronaldo",
    role: "Athlete",
    label: "Positive",
    image: "/images/people/cristiano-ronaldo.jpg",
    region: "Global",
    summary:
      "Football legend leveraging massive social media following into global brand while continuing athletic career in Saudi Arabia.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 90,
    trend7d: 1,
    trend30d: 3,
    keyTopics: ["Football", "Brand building", "Social media"],
    strengths: [
      "Largest social media following",
      "Global brand recognition",
    ],
    risks: [
      "Career twilight approaching",
      "Saudi move controversial for some",
    ],
    trendNotes: [
      "Social media engagement remains high",
      "Brand partnerships expanding",
    ],
    scores: { approval: 74, trust: 68, impact: 83, controversy: 38 },
  },
  {
    slug: "oprah-winfrey",
    name: "Oprah Winfrey",
    role: "Media mogul",
    label: "Positive",
    image: "/images/people/oprah-winfrey.jpg",
    region: "United States",
    summary:
      "Media empire and cultural influence remain strong through book club, streaming content, and strategic interventions in social causes.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 82,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["Media", "Book club", "Philanthropy"],
    strengths: [
      "Enduring trust and credibility",
      "Book club still moves markets",
    ],
    risks: [
      "Relevance questions with younger demos",
      "Occasional endorsement controversies",
    ],
    trendNotes: [
      "Streaming deals keeping profile active",
      "Social cause involvement continues",
    ],
    scores: { approval: 76, trust: 74, impact: 76, controversy: 28 },
  },
  // Science, Health & Thought Leaders
  {
    slug: "yuval-noah-harari",
    name: "Yuval Noah Harari",
    role: "Historian",
    label: "Mixed to positive",
    image: "/images/people/yuval-noah-harari.jpg",
    region: "Israel",
    summary:
      "Bestselling historian shaping discourse on AI, humanity's future, and technological transformation through books, talks, and advisory roles.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 79,
    trend7d: 2,
    trend30d: 4,
    keyTopics: ["AI philosophy", "Human future", "Technology ethics"],
    strengths: [
      "Massive book sales globally",
      "Influencing tech leaders",
    ],
    risks: [
      "Academic critics questioning depth",
      "Predictions seen as speculative",
    ],
    trendNotes: [
      "AI warnings resonating widely",
      "New book generating buzz",
    ],
    scores: { approval: 68, trust: 64, impact: 73, controversy: 44 },
  },
  {
    slug: "peter-thiel",
    name: "Peter Thiel",
    role: "Investor",
    label: "Polarizing",
    image: "/images/people/peter-thiel.jpg",
    region: "United States",
    summary:
      "PayPal co-founder and Palantir creator influencing tech policy, political funding, and startup investing with contrarian libertarian views.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 81,
    trend7d: 0,
    trend30d: 1,
    keyTopics: ["Venture capital", "Politics", "Tech philosophy"],
    strengths: [
      "Track record in tech investing",
      "Influential network effects",
    ],
    risks: [
      "Political activities controversial",
      "Libertarian views polarizing",
    ],
    trendNotes: [
      "Political donations under scrutiny",
      "Palantir growth continues",
    ],
    scores: { approval: 46, trust: 42, impact: 75, controversy: 78 },
  },
  {
    slug: "jennifer-doudna",
    name: "Jennifer Doudna",
    role: "Scientist",
    label: "Positive",
    image: "/images/people/jennifer-doudna.jpg",
    region: "United States",
    summary:
      "Nobel laureate co-inventor of CRISPR gene editing technology navigating scientific breakthroughs, ethical considerations, and commercial applications.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 78,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["Gene editing", "Biotech ethics", "Scientific research"],
    strengths: [
      "Nobel Prize credibility",
      "Revolutionary technology impact",
    ],
    risks: [
      "Ethical debates on gene editing",
      "Patent disputes with collaborators",
    ],
    trendNotes: [
      "CRISPR therapies reaching market",
      "Ethics guidance increasingly sought",
    ],
    scores: { approval: 74, trust: 76, impact: 77, controversy: 36 },
  },
  {
    slug: "kamala-harris",
    name: "Kamala Harris",
    role: "Vice President",
    label: "Mixed to polarizing",
    image: "/images/people/kamala-harris.jpg",
    region: "United States",
    summary:
      "Historic Vice President navigating complex portfolio while positioning for potential future leadership amid mixed public perception.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 80,
    trend7d: 0,
    trend30d: 1,
    keyTopics: ["Immigration", "Voting rights", "Presidential ambitions"],
    strengths: [
      "Historic representation",
      "Strong coalition support",
    ],
    risks: [
      "Challenging VP portfolio",
      "Mixed approval ratings",
    ],
    trendNotes: [
      "Policy initiatives gaining attention",
      "2028 speculation ongoing",
    ],
    scores: { approval: 50, trust: 46, impact: 74, controversy: 66 },
  },
  {
    slug: "tim-cook",
    name: "Tim Cook",
    role: "Tech CEO",
    label: "Mixed to positive",
    image: "/images/people/tim-cook.jpg",
    region: "United States",
    summary:
      "Apple CEO maintaining world's most valuable company through services growth, China navigation, and Vision Pro launch amid innovation questions.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 84,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["Consumer tech", "Privacy", "Supply chain"],
    strengths: [
      "Consistent execution and growth",
      "Strong brand loyalty",
    ],
    risks: [
      "Innovation perception challenges",
      "China exposure concerns",
    ],
    trendNotes: [
      "Vision Pro reviews mixed but promising",
      "Services revenue growing steadily",
    ],
    scores: { approval: 64, trust: 62, impact: 85, controversy: 36 },
  },
  {
    slug: "dario-amodei",
    name: "Dario Amodei",
    role: "AI CEO",
    label: "Positive",
    image: "/images/people/dario-amodei.jpg",
    region: "United States",
    summary:
      "Anthropic CEO positioning Claude as ethical OpenAI alternative, emphasizing AI safety and Constitutional AI approach.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 76,
    trend7d: 2,
    trend30d: 5,
    keyTopics: ["AI safety", "Constitutional AI", "Ethics"],
    strengths: [
      "Strong safety focus resonates",
      "Technical credibility high",
    ],
    risks: [
      "Fierce competition from OpenAI",
      "Funding needs vs OpenAI/Google",
    ],
    trendNotes: [
      "Claude 4 well-received",
      "Enterprise adoption growing",
    ],
    scores: { approval: 70, trust: 72, impact: 76, controversy: 28 },
  },
  {
    slug: "giorgia-meloni",
    name: "Giorgia Meloni",
    role: "Prime Minister",
    label: "Polarizing",
    image: "/images/people/giorgia-meloni.jpg",
    region: "Italy",
    summary:
      "Italy's first female PM balancing populist mandate with EU responsibilities, drawing scrutiny over immigration policies and democratic norms.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 78,
    trend7d: 0,
    trend30d: 1,
    keyTopics: ["Immigration", "EU relations", "Economic policy"],
    strengths: [
      "Strong domestic mandate",
      "Pragmatic EU engagement",
    ],
    risks: [
      "Democratic backsliding concerns",
      "Far-right associations",
    ],
    trendNotes: [
      "EU relationship stabilizing",
      "Immigration policies controversial",
    ],
    scores: { approval: 54, trust: 48, impact: 68, controversy: 72 },
  },
  {
    slug: "bill-gates",
    name: "Bill Gates",
    role: "Philanthropist",
    label: "Mixed to polarizing",
    image: "/images/people/bill-gates.jpg",
    region: "United States",
    summary:
      "Massive philanthropic influence through Gates Foundation while facing conspiracy theories and criticism over wealth, health initiatives, and climate advocacy.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 86,
    trend7d: 0,
    trend30d: 1,
    keyTopics: ["Global health", "Climate", "Philanthropy"],
    strengths: [
      "Massive resources for global challenges",
      "Strong scientific backing",
    ],
    risks: [
      "Conspiracy theory target",
      "Wealth inequality symbol",
    ],
    trendNotes: [
      "Climate tech investments expanding",
      "Foundation impact remains substantial",
    ],
    scores: { approval: 54, trust: 50, impact: 82, controversy: 70 },
  },
  {
    slug: "lebron-james",
    name: "LeBron James",
    role: "Athlete",
    label: "Positive to mixed",
    image: "/images/people/lebron-james.jpg",
    region: "United States",
    summary:
      "Basketball legend balancing athletic longevity with media empire, social activism, and business ventures across entertainment and sports.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 85,
    trend7d: 1,
    trend30d: 2,
    keyTopics: ["Basketball", "Social justice", "Media production"],
    strengths: [
      "Sustained athletic excellence",
      "Strong business acumen",
    ],
    risks: [
      "Political statements polarize",
      "Career twilight approaching",
    ],
    trendNotes: [
      "SpringHill entertainment growing",
      "Social activism continues",
    ],
    scores: { approval: 68, trust: 64, impact: 76, controversy: 48 },
  },
  {
    slug: "bernard-arnault",
    name: "Bernard Arnault",
    role: "Business CEO",
    label: "Mixed",
    image: "/images/people/bernard-arnault.jpg",
    region: "France",
    summary:
      "LVMH empire builder and world's richest person navigating luxury market dynamics, family succession, and Chinese market exposure.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 79,
    trend7d: 0,
    trend30d: -1,
    keyTopics: ["Luxury goods", "Wealth", "Family business"],
    strengths: [
      "Dominant luxury portfolio",
      "Strong brand management",
    ],
    risks: [
      "Chinese market slowdown",
      "Wealth inequality criticism",
    ],
    trendNotes: [
      "Stock performance under pressure",
      "Tiffany integration ongoing",
    ],
    scores: { approval: 52, trust: 50, impact: 72, controversy: 44 },
  },
  {
    slug: "recep-tayyip-erdogan",
    name: "Recep Tayyip Erdogan",
    role: "President",
    label: "Polarizing",
    image: "/images/people/recep-tayyip-erdogan.jpg",
    region: "Turkey",
    summary:
      "Long-serving Turkish leader wielding regional influence through strategic positioning between NATO and Russia, amid democratic concerns.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 81,
    trend7d: -1,
    trend30d: 0,
    keyTopics: ["Regional geopolitics", "Economic challenges", "Democracy"],
    strengths: [
      "Strategic geopolitical position",
      "Strong domestic support base",
    ],
    risks: [
      "Economic crisis ongoing",
      "Democratic backsliding concerns",
    ],
    trendNotes: [
      "Inflation pressures mounting",
      "NATO/Russia balancing continues",
    ],
    scores: { approval: 46, trust: 40, impact: 76, controversy: 80 },
  },
  {
    slug: "yann-lecun",
    name: "Yann LeCun",
    role: "AI Researcher",
    label: "Positive",
    image: "/images/people/yann-lecun.jpg",
    region: "United States",
    summary:
      "Meta's chief AI scientist and Turing Award winner advancing open-source AI while publicly debating existential risk concerns with other researchers.",
    lastUpdated: "2026-05-20",
    sourceConfidence: 80,
    trend7d: 1,
    trend30d: 3,
    keyTopics: ["AI research", "Open source", "AI safety debates"],
    strengths: [
      "Foundational deep learning work",
      "Strong open-source advocacy",
    ],
    risks: [
      "Safety debate positioning controversial",
      "Corporate AI vs research tension",
    ],
    trendNotes: [
      "Open-source AI push gaining support",
      "Public debates with Hinton draw attention",
    ],
    scores: { approval: 72, trust: 70, impact: 75, controversy: 38 },
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
