const clientLogos = [
  { name: "eThekwini Municipality", src: "/images/clients/ethekwini.png" },
  { name: "FASSET", src: "/images/clients/fasset.png" },
  { name: "KZN Health Department", src: "/images/clients/kzn_health.png" },
  { name: "Department of Justice and Constitutional Development", src: "/images/clients/doj_cd.png" },
  { name: "Legal Aid South Africa", src: "/images/clients/legal_aid.png" },
  { name: "Capital Power", src: "/images/clients/capital_power.png" },
  { name: "The Playhouse Company", src: "/images/clients/playhouse_company.png" },
  { name: "Technology Innovation Agency", src: "/images/clients/tia.png" },
];

const duplicatedLogos = [
  ...clientLogos.map((logo, idx) => ({ ...logo, id: `set1-${idx}` })),
  ...clientLogos.map((logo, idx) => ({ ...logo, id: `set2-${idx}` })),
  ...clientLogos.map((logo, idx) => ({ ...logo, id: `set3-${idx}` })),
  ...clientLogos.map((logo, idx) => ({ ...logo, id: `set4-${idx}` })),
];

export function ClientLogos() {
  return (
    <section className="relative w-full overflow-hidden bg-secondary/35 py-10 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
          Trusted on major sites & industrial projects South Africa wide
        </p>
      </div>
      <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
        <div className="flex gap-8 md:gap-12 items-center shrink-0 animate-marquee py-2 select-none">
          {duplicatedLogos.map((logo) => (
            <div 
              key={logo.id} 
              className="opacity-75 hover:opacity-100 transition-opacity duration-300 bg-white p-3 rounded-md shadow-sm border border-zinc-200/50 flex items-center justify-center h-14 md:h-16 px-6 shrink-0"
            >
              <img 
                src={logo.src} 
                alt={logo.name} 
                className="h-full w-auto object-contain max-w-[130px] md:max-w-[160px]" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
