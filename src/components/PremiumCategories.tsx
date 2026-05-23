import React, { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Shield, Compass, HardHat } from "lucide-react";

interface CategoryCard {
  id: string;
  name: string;
  slug: string;
  label: string;
  image: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CARDS: CategoryCard[] = [
  {
    id: "workwear",
    name: "Heavy-Duty Workwear",
    slug: "conti-suits",
    label: "Conti Suits & Warehouse Wear",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    desc: "SABS-approved hard-wearing industrial clothing, conti suits, and protective warehouse wear built for daily site utility.",
    icon: HardHat,
  },
  {
    id: "corporate",
    name: "Corporate Wear",
    slug: "corporate-wear",
    label: "Executive & Office Apparel",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    desc: "Sophisticated, high-grade branded corporate uniforms and tailored clothing designed to elevate your company's front-line image.",
    icon: Shield,
  },
  {
    id: "safety-footwear",
    name: "Safety Footwear",
    slug: "safety-footwear",
    label: "Steel Toe & SABS Boots",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    desc: "Industrial-grade safety footwear engineered for maximum impact protection, slip resistance, and complete on-site compliance.",
    icon: Compass,
  },
  {
    id: "hi-vis",
    name: "Hi-Visibility Gear",
    slug: "hi-vis",
    label: "EN ISO 20471 Reflective Wear",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    desc: "Certified high-visibility reflective vests, jackets, and safety wear ensuring elite worker visibility under all hazardous environments.",
    icon: Sparkles,
  },
  {
    id: "chef-wear",
    name: "Premium Chef Wear",
    slug: "chef-wear",
    label: "Culinary & Hospitality Uniforms",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
    desc: "Vented chef jackets, trousers, and kitchen apparel balancing heat-resistance, supreme hygiene, and elegant culinary presentation.",
    icon: Shield,
  },
  {
    id: "aprons",
    name: "Industrial Aprons",
    slug: "aprons",
    label: "Protective Outer Aprons",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    desc: "Heavy-duty leather, PVC, and poly-cotton utility aprons engineered to withstand intense friction, liquid splash, and tool wear.",
    icon: Compass,
  }
];

export function PremiumCategories() {
  const [tiltStyles, setTiltStyles] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered scroll reveal using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 3D Tilt interactive calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Tilt intensity caps (max ~8 degrees tilt)
    const tiltX = (yc - y) / 15; 
    const tiltY = (x - xc) / 15; 
    
    setTiltStyles((prev) => ({
      ...prev,
      [id]: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
    }));
  };

  const handleMouseLeave = (id: string) => {
    setTiltStyles((prev) => ({
      ...prev,
      [id]: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }));
  };

  return (
    <section 
      ref={containerRef}
      className="relative bg-[#050B18] text-[#F5F5F5] py-24 md:py-32 overflow-hidden border-t border-b border-white/5"
    >
      {/* Tactical textures in main section background */}
      <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 tactical-stripes opacity-15 pointer-events-none" />
      
      {/* Decorative High-End Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#FFD000]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-[#FFD000]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 text-center md:text-left md:flex md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#FFD000] font-bold mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFD000] animate-pulse" />
              SABS Standard Sector Portfolios
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight uppercase">
              Outfit Your Entire <span className="text-[#FFD000]">Industrial Team</span>
            </h2>
            <p className="mt-4 text-[#F5F5F5]/70 text-sm md:text-base leading-relaxed">
              Explore premium industry-compliant gear tailored for intense on-site safety, corporate identity presentation, and durable daily utility.
            </p>
          </div>
          <Link
            to="/shop"
            search={{ category: "", q: "" }}
            className="hidden md:inline-flex items-center gap-2 border border-[#FFD000]/25 bg-[#FFD000]/5 text-[#FFD000] hover:bg-[#FFD000] hover:text-black font-semibold text-xs uppercase tracking-wider px-6 h-11 rounded-sm transition-all duration-300"
          >
            Browse All Gear
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Categories Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CARDS.map((card, idx) => {
            const Icon = card.icon;
            const cardTilt = tiltStyles[card.id] || "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            
            return (
              <div
                key={card.id}
                onMouseMove={(e) => handleMouseMove(e, card.id)}
                onMouseLeave={() => handleMouseLeave(card.id)}
                style={{ 
                  transform: cardTilt,
                  transition: "transform 0.1s ease-out, opacity 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1s ease-out"
                }}
                className={`group relative h-[420px] rounded-lg overflow-hidden border border-white/10 bg-[#0F1115]/85 backdrop-blur-md shadow-2xl hover:border-[#FFD000]/40 cursor-pointer ${
                  isVisible 
                    ? "opacity-100 translate-y-0 blur-none" 
                    : "opacity-0 translate-y-16 blur-md"
                }`}
                style={{
                  transform: cardTilt,
                  transitionDelay: `${idx * 150}ms`
                }}
              >
                {/* Background Lifestyle Image with subtle scale */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${card.image})` }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/70 to-[#050B18]/15" />
                
                {/* Subtle Industrial Card Warning Texture Grid overlay */}
                <div className="absolute inset-0 tactical-grid opacity-10 pointer-events-none" />

                {/* Sweeping Light Sheen Layer */}
                <div className="sheen-glow transition-all duration-1000 ease-out group-hover:translate-x-[600%]" />

                {/* Top Border Glow Indicator */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD000]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner Tech Border Elements */}
                <div className="absolute top-3 left-3 h-1.5 w-1.5 border-t border-l border-white/20 group-hover:border-[#FFD000]/50 transition-colors duration-300" />
                <div className="absolute top-3 right-3 h-1.5 w-1.5 border-t border-r border-white/20 group-hover:border-[#FFD000]/50 transition-colors duration-300" />
                <div className="absolute bottom-3 left-3 h-1.5 w-1.5 border-b border-l border-white/20 group-hover:border-[#FFD000]/50 transition-colors duration-300" />
                <div className="absolute bottom-3 right-3 h-1.5 w-1.5 border-b border-r border-white/20 group-hover:border-[#FFD000]/50 transition-colors duration-300" />

                {/* Floating Tech Sector Icon (Matte badge) */}
                <div className="absolute top-4 left-4 flex items-center justify-center h-8 w-8 rounded bg-[#0F1115]/90 border border-white/10 backdrop-blur text-white/50 group-hover:text-[#FFD000] group-hover:border-[#FFD000]/30 transition-all duration-300">
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content Block */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full pointer-events-none">
                  {/* Category Tech Label */}
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFD000] font-bold mb-1 opacity-80 transition-all duration-300 group-hover:translate-y-[-2px]">
                    {card.label}
                  </span>
                  
                  {/* Category Title */}
                  <h3 className="text-xl font-bold font-display text-white tracking-tight uppercase transition-all duration-300 group-hover:translate-y-[-2px]">
                    {card.name}
                  </h3>
                  
                  {/* Category Description - Slides up on hover */}
                  <p className="text-xs text-white/70 leading-relaxed mt-2 max-h-0 opacity-0 overflow-hidden group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                    {card.desc}
                  </p>

                  {/* Explore Button CTA - Fades & slides up on hover */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-black bg-[#FFD000] px-4 py-2 w-fit rounded-sm opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    <Link
                      to="/shop"
                      search={{ category: card.slug, q: "" }}
                      className="pointer-events-auto flex items-center gap-1"
                    >
                      EXPLORE DEPT
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View CTA */}
        <div className="mt-12 text-center md:hidden">
          <Link
            to="/shop"
            search={{ category: "", q: "" }}
            className="inline-flex items-center justify-center gap-2 border border-[#FFD000]/25 bg-[#FFD000]/5 text-[#FFD000] hover:bg-[#FFD000] hover:text-black font-semibold text-xs uppercase tracking-wider px-6 h-11 w-full rounded-sm transition-all duration-300"
          >
            Browse All Gear
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
