// Custom vector logos for real South African institutional clients
const Logos = {
  Ethekwini: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 stroke-[1.5] shrink-0" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="ethekwiniGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3FA9F5" />
            <stop offset="100%" stopColor="#2B3990" />
          </linearGradient>
        </defs>
        {/* Cupola */}
        <path d="M 44,32 V 22 A 6,6 0 0,1 56,22 V 32" fill="url(#ethekwiniGrad)" stroke="#2B3990" strokeWidth="2" strokeLinejoin="round" />
        <line x1="50" y1="16" x2="50" y2="32" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" />
        <path d="M 40,28 H 60" stroke="#2B3990" strokeWidth="2" />
        
        {/* Main Dome */}
        <path d="M 20,68 C 20,44 32,32 50,32 C 68,32 80,44 80,68 Z" fill="url(#ethekwiniGrad)" stroke="#2B3990" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Meridians */}
        <path d="M 50,32 V 68" stroke="#ffffff" strokeWidth="2" />
        <path d="M 50,32 C 40,40 33,52 33,68" stroke="#ffffff" strokeWidth="2" />
        <path d="M 50,32 C 60,40 67,52 67,68" stroke="#ffffff" strokeWidth="2" />
        
        {/* Base Bar */}
        <path d="M 15,68 H 85 V 74 H 15 Z" fill="#2B3990" stroke="#2B3990" strokeWidth="1" strokeLinejoin="round" />
      </svg>
      <span>ETHEKWINI MUNICIPALITY</span>
    </div>
  ),
  Fasset: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 100 100">
        <defs>
          <clipPath id="fassetClip">
            <circle cx="55" cy="45" r="38" />
          </clipPath>
        </defs>
        <g clipPath="url(#fassetClip)">
          {/* Dark Blue fanning rays */}
          <path 
            d="M 45,65 L 10,45 L 20,30 Z 
               M 45,65 L 25,20 L 40,10 Z 
               M 45,65 L 50,5 L 65,8 Z 
               M 45,65 L 75,15 L 88,30 Z 
               M 45,65 L 92,48 L 80,68 Z" 
            fill="#0B2265" 
          />
        </g>
        {/* Sun shape overlay */}
        <circle cx="45" cy="65" r="14" fill="#FFEB00" stroke="#ffffff" strokeWidth="2" />
      </svg>
      <span>FASSET</span>
    </div>
  ),
  KznHealth: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-7 h-7 shrink-0" viewBox="0 0 120 100" fill="none">
        {/* Shield Background */}
        <path d="M 45,25 C 45,55 50,70 60,78 C 70,70 75,55 75,25 Z" fill="#15803D" stroke="#15803D" strokeWidth="2" strokeLinejoin="round" />
        {/* Shield Inner Divisions */}
        {/* Top Blue section */}
        <path d="M 46,26 H 74 V 42 L 60,50 L 46,42 Z" fill="#2563EB" />
        {/* White Star in blue section */}
        <polygon points="60,30 62,34 66,34 63,37 64,41 60,39 56,41 57,37 54,34 58,34" fill="#ffffff" />
        {/* Zigzag Green hills */}
        <path d="M 46,42 L 53,38 L 60,45 L 67,38 L 74,42 V 55 L 60,65 L 46,55 Z" fill="#16A34A" />
        {/* White bottom section with Strelitzia flower */}
        <path d="M 46,55 L 60,65 L 74,55 V 70 C 74,70 70,75 60,77 C 50,75 46,70 46,70 Z" fill="#ffffff" />
        {/* Simplified Strelitzia Flower (Provincial Flower) */}
        <path d="M 60,58 C 58,54 62,50 60,48 C 62,52 64,54 60,58 Z" fill="#EA580C" />
        <path d="M 60,58 C 56,56 56,62 55,60 C 58,60 59,58 60,58 Z" fill="#3B82F6" />

        {/* Left Supporter (Lion) */}
        <path d="M 25,65 C 28,60 32,58 35,48 C 38,38 34,32 37,28 C 39,25 42,28 41,32 C 40,35 43,38 42,42 C 41,46 44,50 43,55 C 42,60 38,65 38,70 L 32,70 C 31,66 28,68 25,65 Z" fill="#EAB308" />
        <line x1="32" y1="28" x2="38" y2="40" stroke="#EAB308" strokeWidth="1.5" />

        {/* Right Supporter (Wildebeest) */}
        <path d="M 95,65 C 92,60 88,58 85,48 C 82,38 86,32 83,28 C 81,25 78,28 79,32 C 80,35 77,38 78,42 C 79,46 76,50 77,55 C 78,60 82,65 82,70 L 88,70 C 89,66 92,68 95,65 Z" fill="#78350F" />
        <line x1="88" y1="26" x2="82" y2="40" stroke="#1F2937" strokeWidth="1.5" />

        {/* Top Crown/Emblem */}
        <path d="M 52,25 C 52,18 68,18 68,25 Z" fill="#CA8A04" />
        <circle cx="60" cy="18" r="4" fill="#CA8A04" />

        {/* Bottom Scroll */}
        <path d="M 25,72 Q 60,82 95,72 L 92,78 Q 60,88 28,78 Z" fill="#ffffff" stroke="#15803D" strokeWidth="1" />
      </svg>
      <span>KZN HEALTH</span>
    </div>
  ),
  Dojcd: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-7 h-7 shrink-0" viewBox="0 0 100 100" fill="none">
        {/* Rising Sun */}
        <path d="M 35,22 L 50,8 L 65,22 Z" fill="#EA580C" />
        <path d="M 42,20 L 50,5 L 58,20 Z" fill="#EA580C" />
        
        {/* Secretary Bird / Wings */}
        <path d="M 15,42 C 12,28 35,28 50,42 C 65,28 88,28 85,42 C 82,55 68,65 50,65 C 32,65 18,55 15,42 Z" stroke="#CA8A04" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Shield */}
        <path d="M 40,45 C 40,62 45,70 50,73 C 55,70 60,62 60,45 Z" fill="#15803D" stroke="#CA8A04" strokeWidth="1.5" />
        
        {/* Spears behind shield */}
        <line x1="32" y1="62" x2="68" y2="45" stroke="#1F2937" strokeWidth="1.5" />
        
        {/* Ribbon Scroll */}
        <path d="M 25,70 Q 50,80 75,70" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span>DEPARTMENT OF JUSTICE</span>
    </div>
  ),
  LegalAid: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
        {/* Left Figure (Blue) */}
        <path d="M 7,10 L 11,14 L 7,18 L 3,14 Z" stroke="#0284C7" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="7" cy="7" r="1.8" fill="#0284C7" />
        <circle cx="7" cy="20" r="1.5" fill="#B91C1C" />
        
        {/* Right Figure (Red) */}
        <path d="M 15,10 L 19,14 L 15,18 L 11,14 Z" stroke="#B91C1C" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="15" cy="7" r="1.8" fill="#0284C7" />
        <circle cx="15" cy="20" r="1.5" fill="#B91C1C" />
      </svg>
      <span>LEGAL AID SA</span>
    </div>
  ),
  CapitalPower: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
        {/* Dark Blue Swoosh */}
        <path d="M 18,5 C 10,7 8,15 14,19 C 15,20 18,17 19,15 C 14,14 13,8 18,5 Z" fill="#334155" />
        {/* Gold Swoosh */}
        <path d="M 18,5 C 22,8 21,14 18,16 C 16,14 15,8 18,5 Z" fill="#CA8A04" />
      </svg>
      <span>CAPITAL POWER</span>
    </div>
  ),
  Playhouse: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
        {/* Artistic Colorful Masks/Waves */}
        <path d="M 2,12 C 4,6 10,6 12,10 C 14,14 18,14 22,10" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
        <path d="M 4,14 C 6,9 11,9 13,12 C 15,15 19,15 21,12" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 6,16 C 8,12 12,12 14,14 C 16,16 18,16 20,14" stroke="#0284C7" strokeWidth="1" strokeLinecap="round" />
        {/* Eye/Face dot details */}
        <circle cx="10" cy="9" r="1" fill="#7C3AED" />
        <circle cx="15" cy="11" r="1" fill="#EA580C" />
      </svg>
      <span>THE PLAYHOUSE COMPANY</span>
    </div>
  ),
  Tia: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-7 h-7 shrink-0" viewBox="0 0 100 100" fill="none">
        {/* Blue Wing/Chevron */}
        <path d="M 10,50 L 40,15 L 55,28 L 30,55 Z" fill="#0B2265" />
        {/* Grey Chevron */}
        <path d="M 35,55 L 60,25 L 75,38 L 55,60 Z" fill="#94A3B8" />
        {/* Orange Chevron */}
        <path d="M 50,60 L 70,35 L 85,48 L 70,65 Z" fill="#EA580C" />
        {/* Orange Circle Sun */}
        <circle cx="48" cy="22" r="8" fill="#EA580C" />
      </svg>
      <span>TECHNOLOGY INNOVATION AGENCY</span>
    </div>
  ),
};

const clientLogos = [
  <Logos.Ethekwini key="ethekwini-1" />,
  <Logos.Fasset key="fasset-1" />,
  <Logos.KznHealth key="kznhealth-1" />,
  <Logos.Dojcd key="dojcd-1" />,
  <Logos.LegalAid key="legalaid-1" />,
  <Logos.CapitalPower key="capitalpower-1" />,
  <Logos.Playhouse key="playhouse-1" />,
  <Logos.Tia key="tia-1" />,
  <Logos.Ethekwini key="ethekwini-2" />,
  <Logos.Fasset key="fasset-2" />,
  <Logos.KznHealth key="kznhealth-2" />,
  <Logos.Dojcd key="dojcd-2" />,
  <Logos.LegalAid key="legalaid-2" />,
  <Logos.CapitalPower key="capitalpower-2" />,
  <Logos.Playhouse key="playhouse-2" />,
  <Logos.Tia key="tia-2" />,
];

export function ClientLogos() {
  return (
    <section className="relative w-full overflow-hidden bg-secondary/35 py-8 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
          Trusted on major sites & industrial projects South Africa wide
        </p>
      </div>
      <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
        <div className="flex gap-20 md:gap-28 items-center shrink-0 animate-marquee py-2 select-none">
          {/* First set */}
          {clientLogos.map((Logo, idx) => (
            <div key={`logo-1-${idx}`} className="opacity-65 hover:opacity-100 transition-opacity duration-300 text-zinc-700 dark:text-zinc-300">
              {Logo}
            </div>
          ))}
          {/* Duplicate set for a seamless, infinite loop */}
          {clientLogos.map((Logo, idx) => (
            <div key={`logo-2-${idx}`} className="opacity-65 hover:opacity-100 transition-opacity duration-300 text-zinc-700 dark:text-zinc-300">
              {Logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
