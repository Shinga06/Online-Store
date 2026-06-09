// Custom, modern industrial vector logos representing major client industries
const Logos = {
  ApexMining: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 stroke-[1.5] fill-none" viewBox="0 0 24 24">
        <path d="M12 2L2 22h20L12 2z" stroke="currentColor" strokeLinejoin="round" />
        <path d="M12 8l-6 10h12L12 8z" stroke="currentColor" strokeLinejoin="round" opacity="0.6" />
      </svg>
      <span>APEX MINING</span>
    </div>
  ),
  SummitPower: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 stroke-[1.5] fill-none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path d="M13 6l-4 7h5l-4 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>SUMMIT ENERGY</span>
    </div>
  ),
  VanguardSteel: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 stroke-[1.5] fill-none" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeLinejoin="round" />
        <path d="M9 10l2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>VANGUARD STEEL</span>
    </div>
  ),
  DeltaBuild: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 stroke-[1.5] fill-none" viewBox="0 0 24 24">
        <path d="M3 21h18M5 21V8l7-5 7 5v13" stroke="currentColor" strokeLinejoin="round" />
        <path d="M9 13h6v8H9v-8z" stroke="currentColor" strokeLinejoin="round" />
      </svg>
      <span>DELTA BUILD</span>
    </div>
  ),
  SafewayLogistics: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 stroke-[1.5] fill-none" viewBox="0 0 24 24">
        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12h1" stroke="currentColor" strokeLinecap="round" />
      </svg>
      <span>SAFEWAY LOGISTICS</span>
    </div>
  ),
  TitanForestry: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 stroke-[1.5] fill-none" viewBox="0 0 24 24">
        <path d="M12 2L3 17h6v5h6v-5h6L12 2z" stroke="currentColor" strokeLinejoin="round" />
      </svg>
      <span>TITAN FORESTRY</span>
    </div>
  ),
  Ethekwini: () => (
    <div className="flex items-center gap-2 font-display font-semibold tracking-wider text-xs select-none">
      <svg className="w-6 h-6 stroke-[1.5] fill-none" viewBox="0 0 100 100">
        <path d="M 44,32 V 22 A 6,6 0 0,1 56,22 V 32" stroke="currentColor" strokeLinejoin="round" />
        <line x1="50" y1="16" x2="50" y2="32" stroke="currentColor" strokeDasharray="1 1" />
        <path d="M 40,28 H 60" stroke="currentColor" />
        <path d="M 20,68 C 20,44 32,32 50,32 C 68,32 80,44 80,68 Z" stroke="currentColor" strokeLinejoin="round" />
        <path d="M 50,32 V 68" stroke="currentColor" />
        <path d="M 50,32 C 40,40 33,52 33,68" stroke="currentColor" />
        <path d="M 50,32 C 60,40 67,52 67,68" stroke="currentColor" />
        <path d="M 15,68 H 85 V 74 H 15 Z" stroke="currentColor" strokeLinejoin="round" />
      </svg>
      <span>ETHEKWINI MUNICIPALITY</span>
    </div>
  ),
};

const clientLogos = [
  <Logos.ApexMining key="apex" />,
  <Logos.SummitPower key="summit" />,
  <Logos.VanguardSteel key="vanguard" />,
  <Logos.DeltaBuild key="delta" />,
  <Logos.SafewayLogistics key="safeway" />,
  <Logos.TitanForestry key="titan" />,
  <Logos.Ethekwini key="ethekwini" />,
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
            <div key={`logo-1-${idx}`} className="text-muted-foreground/45 hover:text-foreground transition-colors duration-300">
              {Logo}
            </div>
          ))}
          {/* Duplicate set for a seamless, infinite loop */}
          {clientLogos.map((Logo, idx) => (
            <div key={`logo-2-${idx}`} className="text-muted-foreground/45 hover:text-foreground transition-colors duration-300">
              {Logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
