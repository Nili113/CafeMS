// Curated Artisanal Vector Logos for Nepalese & Specialty Cafes
// Designed to look like high-end boutique hospitality branding

export interface CafeLogoPreset {
  id: string;
  name: string;
  motif: string;
  description: string;
  svgDataUri: string;
}

const encodeSvg = (svg: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const ARTISANAL_CAFE_LOGOS: CafeLogoPreset[] = [
  {
    id: 'matka_chiya',
    name: 'Matka Chiya Earthenware',
    motif: 'Chiya & Teas',
    description: 'Traditional clay pot with warm aromatic steam and terracotta terracotta tones.',
    svgDataUri: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#9A3412"/>
            <stop offset="100%" stop-color="#7C2D12"/>
          </linearGradient>
          <linearGradient id="warmGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24"/>
            <stop offset="100%" stop-color="#D97706"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="28" fill="url(#terracottaGrad)"/>
        <!-- Outer thin seal circle -->
        <circle cx="60" cy="60" r="48" fill="none" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1.5" stroke-dasharray="4 3"/>
        <!-- Steam swirls -->
        <path d="M50 38 Q48 30 52 24" fill="none" stroke="#FDE68A" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
        <path d="M60 36 Q62 26 58 20" fill="none" stroke="#FDE68A" stroke-width="2.5" stroke-linecap="round" opacity="0.95"/>
        <path d="M70 38 Q72 30 68 24" fill="none" stroke="#FDE68A" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
        <!-- Clay Matka silhouette -->
        <path d="M42 46 C42 46 48 50 60 50 C72 50 78 46 78 46 C80 56 86 66 84 76 C82 86 72 92 60 92 C48 92 38 86 36 76 C34 66 40 56 42 46 Z" fill="#F97316"/>
        <ellipse cx="60" cy="46" rx="18" ry="4" fill="url(#warmGold)"/>
        <!-- Matka earthen rim decor -->
        <path d="M40 64 C48 70 72 70 80 64" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>
        <circle cx="60" cy="74" r="3" fill="#FFFFFF" opacity="0.6"/>
      </svg>
    `),
  },
  {
    id: 'roast_bean',
    name: 'Specialty Roast Bean',
    motif: 'Coffee & Espresso',
    description: 'Golden dual-hemisphere coffee bean emblem with circular roastery seal.',
    svgDataUri: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="espressoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#451A03"/>
            <stop offset="100%" stop-color="#1C0A00"/>
          </linearGradient>
          <linearGradient id="goldBean" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24"/>
            <stop offset="100%" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="28" fill="url(#espressoGrad)"/>
        <circle cx="60" cy="60" r="46" fill="none" stroke="#FBBF24" stroke-opacity="0.25" stroke-width="2"/>
        <circle cx="60" cy="60" r="41" fill="none" stroke="#FBBF24" stroke-opacity="0.4" stroke-width="1"/>
        <!-- Stylized angled Coffee Bean -->
        <g transform="rotate(-30 60 60)">
          <ellipse cx="60" cy="60" rx="24" ry="32" fill="url(#goldBean)"/>
          <!-- Characteristic curved center crack -->
          <path d="M60 28 Q52 45 62 60 Q70 75 60 92" fill="none" stroke="#1C0A00" stroke-width="4" stroke-linecap="round"/>
        </g>
        <!-- Stars on side -->
        <circle cx="28" cy="60" r="2" fill="#FBBF24"/>
        <circle cx="92" cy="60" r="2" fill="#FBBF24"/>
      </svg>
    `),
  },
  {
    id: 'steaming_momo',
    name: 'Himalayan Steam Momo',
    motif: 'Kitchen & Bites',
    description: 'Handcrafted dumpling inside bamboo steamer crest with rising steam.',
    svgDataUri: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1B4636"/>
            <stop offset="100%" stop-color="#0F2920"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="28" fill="url(#emeraldGrad)"/>
        <circle cx="60" cy="60" r="48" fill="none" stroke="#34D399" stroke-opacity="0.2" stroke-width="1.5"/>
        <!-- Steam rising -->
        <path d="M52 34 Q50 26 54 20" fill="none" stroke="#A7F3D0" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        <path d="M60 32 Q62 24 58 18" fill="none" stroke="#A7F3D0" stroke-width="2" stroke-linecap="round" opacity="0.9"/>
        <path d="M68 34 Q70 26 66 20" fill="none" stroke="#A7F3D0" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        <!-- Momo Dumpling body -->
        <path d="M36 76 C36 54 84 54 84 76 C84 84 36 84 36 76 Z" fill="#F3F4F6"/>
        <!-- Momo handcrafted pleated top pinch folds -->
        <path d="M60 54 L60 62" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round"/>
        <path d="M52 57 L56 64" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round"/>
        <path d="M68 57 L64 64" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round"/>
        <!-- Steamer bamboo rim base -->
        <path d="M30 84 C30 84 45 92 60 92 C75 92 90 84 90 84" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'heritage_pagoda',
    name: 'Patan Heritage Spire',
    motif: 'Heritage & Culture',
    description: 'Traditional Nepalese multi-tiered pagoda temple crest with lotus base.',
    svgDataUri: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="noirGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181B"/>
            <stop offset="100%" stop-color="#09090B"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="28" fill="url(#noirGold)"/>
        <circle cx="60" cy="60" r="48" fill="none" stroke="#FDE047" stroke-opacity="0.3" stroke-width="1.5"/>
        <!-- Spire finial (Gajur) -->
        <circle cx="60" cy="24" r="3" fill="#FACC15"/>
        <line x1="60" y1="27" x2="60" y2="34" stroke="#FACC15" stroke-width="2"/>
        <!-- Top roof -->
        <path d="M46 42 Q60 36 74 42 L66 36 L54 36 Z" fill="#EAB308"/>
        <!-- Middle roof -->
        <path d="M40 56 Q60 48 80 56 L72 48 L48 48 Z" fill="#CA8A04"/>
        <!-- Lower grand roof -->
        <path d="M32 72 Q60 62 88 72 L78 62 L42 62 Z" fill="#A16207"/>
        <!-- Temple base columns -->
        <rect x="46" y="72" width="28" height="16" fill="#713F12" rx="2"/>
        <rect x="56" y="78" width="8" height="10" fill="#FEF08A" rx="1"/>
        <rect x="36" y="88" width="48" height="4" fill="#FACC15" rx="2"/>
      </svg>
    `),
  },
  {
    id: 'organic_leaf',
    name: 'Mountain Tea Sprig',
    motif: 'Artisanal Teas',
    description: 'Minimalist botanical fresh mountain tea leaf with organic seal ring.',
    svgDataUri: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
        <defs>
          <linearGradient id="teaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064E3B"/>
            <stop offset="100%" stop-color="#022C22"/>
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34D399"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="28" fill="url(#teaGrad)"/>
        <circle cx="60" cy="60" r="46" fill="none" stroke="#6EE7B7" stroke-opacity="0.3" stroke-width="2"/>
        <!-- Main leaf -->
        <path d="M60 28 C78 38 88 64 68 84 C48 64 42 46 60 28 Z" fill="url(#leafGrad)"/>
        <!-- Leaf center vein -->
        <path d="M60 36 Q64 56 66 80" fill="none" stroke="#064E3B" stroke-width="2" stroke-linecap="round"/>
        <!-- Small side bud leaf -->
        <path d="M46 54 C38 48 38 40 46 36 C52 44 52 50 46 54 Z" fill="#6EE7B7"/>
      </svg>
    `),
  },
];

// Default cafe logos mapping for seeded venues
export const DEFAULT_CAFE_LOGOS: Record<string, string> = {
  'c-1': ARTISANAL_CAFE_LOGOS[0].svgDataUri, // Cafe XYZ -> Matka Chiya
  'c-2': ARTISANAL_CAFE_LOGOS[4].svgDataUri, // Himalayan Chiya Bar -> Mountain Tea Sprig
  'c-3': ARTISANAL_CAFE_LOGOS[1].svgDataUri, // The Coffee Foundry -> Roast Bean
  'c-4': ARTISANAL_CAFE_LOGOS[3].svgDataUri, // Patan Heritage Kitchen -> Heritage Spire
  'c-5': ARTISANAL_CAFE_LOGOS[2].svgDataUri, // Pokhara Lakeside Cafe -> Steaming Momo
  'default': ARTISANAL_CAFE_LOGOS[0].svgDataUri,
};
