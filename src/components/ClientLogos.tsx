// Custom vector logos for real South African institutional clients (eThekwini, FASSET, KZN Health, DOJ & CD, Legal Aid, Capital Power, Playhouse Company, and TIA)
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
  DojCd: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none">
        {/* Sun rays at top */}
        <path d="M 35,20 Q 50,8 65,20" stroke="#F97316" strokeWidth="2" />
        <line x1="50" y1="20" x2="50" y2="6" stroke="#F97316" strokeWidth="2" />
        <line x1="50" y1="20" x2="40" y2="9" stroke="#F97316" strokeWidth="2" />
        <line x1="50" y1="20" x2="60" y2="9" stroke="#F97316" strokeWidth="2" />
        
        {/* Secretary Bird Wings */}
        <path d="M 48,30 C 35,28 20,22 15,35 C 12,42 22,50 45,45 Z" fill="#CA8A04" />
        <path d="M 52,30 C 65,28 80,22 85,35 C 88,42 78,50 55,45 Z" fill="#CA8A04" />
        
        {/* Bird Head & Neck */}
        <path d="M 47,40 Q 50,30 52,24 Q 54,28 50,38 Z" fill="#CA8A04" />
        
        {/* Shield */}
        <path d="M 38,48 C 38,48 38,70 50,78 C 62,70 62,48 62,48 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
        {/* Two figures inside shield */}
        <path d="M 45,60 C 45,55 48,58 48,64" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 55,60 C 55,55 52,58 52,64" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="46.5" cy="54" r="1.5" fill="#78350F" />
        <circle cx="53.5" cy="54" r="1.5" fill="#78350F" />
        
        {/* Green Laurel/Wheat at bottom */}
        <path d="M 25,65 Q 30,78 50,82 Q 70,78 75,65" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        {/* Bottom scroll */}
        <path d="M 30,82 Q 50,88 70,82" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col text-[9.5px] leading-tight tracking-normal font-sans font-bold text-left">
        <span className="text-[#EA580C]">the doj & cd</span>
        <span className="text-zinc-500 text-[6.5px] font-normal uppercase">Justice & Constitutional Dev</span>
      </div>
    </div>
  ),
  LegalAid: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-7 h-7 shrink-0" viewBox="0 0 100 100" fill="none">
        {/* Left Diamond (Blue) */}
        <path d="M 38,32 L 18,50 L 38,68 L 50,50 Z" stroke="#008ECF" strokeWidth="5.5" strokeLinejoin="round" />
        {/* Right Diamond (Red/Brown) */}
        <path d="M 62,32 L 82,50 L 62,68 L 50,50 Z" stroke="#8A2B1E" strokeWidth="5.5" strokeLinejoin="round" />
        {/* Heads (Blue) */}
        <circle cx="38" cy="22" r="7.5" fill="#008ECF" />
        <circle cx="62" cy="22" r="7.5" fill="#008ECF" />
        {/* Feet (Red/Brown) */}
        <circle cx="38" cy="78" r="7.5" fill="#8A2B1E" />
        <circle cx="62" cy="78" r="7.5" fill="#8A2B1E" />
      </svg>
      <div className="flex flex-col text-[10px] leading-tight tracking-normal font-sans font-bold text-left">
        <span className="text-[#8A2B1E]">Legal Aid</span>
        <span className="text-[#008ECF] text-[7.5px] uppercase">South Africa</span>
      </div>
    </div>
  ),
  CapitalPower: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <div className="text-[#6B7280] font-sans font-bold text-[13px] tracking-tight">Capital Power</div>
      <svg className="w-6 h-6 shrink-0" viewBox="0 0 100 100" fill="none">
        {/* Blue Swoosh */}
        <path d="M 80,33 C 58,35 48,50 48,68 C 48,78 54,84 62,84 C 54,84 52,72 56,60 C 60,48 70,38 80,33 Z" fill="#34495E" />
        {/* Gold Swoosh */}
        <path d="M 82,38 C 90,44 92,54 88,64 C 84,74 74,78 68,78 C 76,78 80,72 82,62 C 84,52 80,44 82,38 Z" fill="#B5A642" />
      </svg>
    </div>
  ),
  PlayhouseCompany: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none">
        {/* Purple/Blue flow background */}
        <path d="M 10,45 C 10,25 35,20 50,35 C 65,50 90,30 90,48 C 90,65 65,70 45,62 C 25,54 10,65 10,45 Z" fill="#5B21B6" opacity="0.85" />
        
        {/* Face shapes inside the flow */}
        {/* Orange face mask */}
        <path d="M 25,50 C 25,38 38,35 42,45 C 40,52 32,55 25,50 Z" fill="#EA580C" />
        {/* Red lips/accent */}
        <circle cx="35" cy="48" r="2.5" fill="#DC2626" />
        
        {/* White face outline profile */}
        <path d="M 45,35 C 52,38 55,45 52,52" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* SA Flag elements flowing from the profile (Green/Yellow/Blue) */}
        <path d="M 52,35 Q 65,30 75,32" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
        <path d="M 50,42 Q 65,38 78,42" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
        <path d="M 48,49 Q 62,48 75,54" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col text-[10px] leading-tight tracking-normal font-sans font-bold text-left">
        <span className="text-zinc-800 dark:text-zinc-200">The Playhouse</span>
        <span className="text-zinc-500 text-[8px] uppercase">Company</span>
      </div>
    </div>
  ),
  Tia: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 60" fill="none">
        {/* T (Blue wing) */}
        <path d="M 10,12 C 30,12 32,12 32,12 L 10,50 H 19 C 30,30 42,22 50,22 Z" fill="#1E3A8A" />
        {/* I (Orange dot) */}
        <circle cx="47" cy="18" r="6" fill="#F97316" />
        {/* A (Outer Blue chevron) */}
        <path d="M 50,22 L 60,12 L 90,50 H 81 L 60,20 L 50,30 Z" fill="#1E3A8A" />
        {/* A (Middle Grey chevron) */}
        <path d="M 60,22 L 79,50 H 69 L 60,34 L 53,46 Z" fill="#9CA3AF" />
        {/* A (Inner Orange chevron) */}
        <path d="M 60,35 L 67,50 H 47 Z" fill="#F97316" />
      </svg>
      <div className="flex flex-col text-[9px] leading-tight tracking-normal font-sans font-bold text-left">
        <span className="text-[#1E3A8A]">technology innovation</span>
        <span className="text-[#1E3A8A] text-[9.5px] tracking-[0.2em]">AGENCY</span>
      </div>
    </div>
  ),
};

const clientLogos = [
  <Logos.Ethekwini key="ethekwini-1" />,
  <Logos.Fasset key="fasset-1" />,
  <Logos.KznHealth key="kznhealth-1" />,
  <Logos.DojCd key="dojcd-1" />,
  <Logos.LegalAid key="legalaid-1" />,
  <Logos.CapitalPower key="capitalpower-1" />,
  <Logos.PlayhouseCompany key="playhouse-1" />,
  <Logos.Tia key="tia-1" />,
  <Logos.Ethekwini key="ethekwini-2" />,
  <Logos.Fasset key="fasset-2" />,
  <Logos.KznHealth key="kznhealth-2" />,
  <Logos.DojCd key="dojcd-2" />,
  <Logos.LegalAid key="legalaid-2" />,
  <Logos.CapitalPower key="capitalpower-2" />,
  <Logos.PlayhouseCompany key="playhouse-2" />,
  <Logos.Tia key="tia-2" />,
];

export function ClientLogos() {
  return (
    <section className="relative w-full overflow-hidden bg-secondary/35 py-8 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
          Previous Clients
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
