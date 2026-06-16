import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, Factory, Award, Target, Eye } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — CBALCOOL Corporate Solutions" },
      { name: "description", content: "Based in Durban, CBALCOOL is a BBBEE Level 1 youth owned business supplying premium workwear, protective clothing, and corporate uniforms." },
    ],
  }),
});

function AboutPage() {
  return (
    <div>
      {/* Intro Hero Section */}
      <section className="bg-surface text-surface-foreground border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-20 text-left">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--hi-vis)] mb-4">About CBALCOOL</div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl text-white">
            At CBALCOOL Corporate Solutions, we don’t just supply workwear — we power your brand on the ground.
          </h1>
          <div className="mt-8 grid md:grid-cols-2 gap-8 text-white/85 text-base md:text-lg leading-relaxed">
            <p>
              Based in Durban, we are a BBBEE Level 1 youth owned business and a dynamic and forward-thinking provider of premium workwear, protective clothing, and corporate uniforms, built for performance, durability, and style. We serve businesses that demand more — more quality, more reliability, and more impact.
            </p>
            <p>
              From the construction site to the corporate floor, from hospitality to industrial environments — our apparel is designed to protect, perform, and represent.
            </p>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Grid */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Sets Us Apart</h2>
          <p className="text-muted-foreground mt-2">Why businesses trust CBALCOOL for their uniform and PPE needs</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Premium Quality Gear",
              desc: "Built for tough conditions without compromising comfort.",
            },
            {
              icon: Award,
              title: "Bold Branding Solutions",
              desc: "We help your team look professional and stand out.",
            },
            {
              icon: Factory,
              title: "Versatile Product Range",
              desc: "PPE, uniforms, and more.",
            },
            {
              icon: Users,
              title: "Client-Focused Service",
              desc: "Tailored solutions for businesses of all sizes.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 border border-border rounded-lg p-6 bg-card hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-primary/10 rounded-md text-primary h-fit">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Philosophy Banner */}
      <section className="bg-secondary/40 border-y border-border py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3">Our Core Philosophy</p>
          <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground font-medium">
            "Your team is your brand — and what they wear matters."
          </blockquote>
          <p className="text-muted-foreground mt-6 leading-relaxed max-w-2xl mx-auto">
            At CBALCOOL Corporate Solutions we understand one powerful truth: Your team is your brand — and what they wear matters. That’s why we combine functionality with modern design, ensuring every garment not only meets safety standards but also reflects confidence and professionalism.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="border border-border rounded-lg p-8 bg-card flex flex-col items-start hover:border-primary/45 transition-colors duration-300">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-600 mb-6">
              <Target size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To deliver high-performance workwear solutions that enhance safety, strengthen identity, and empower businesses to operate at their best.
            </p>
          </div>

          {/* Vision Card */}
          <div className="border border-border rounded-lg p-8 bg-card flex flex-col items-start hover:border-primary/45 transition-colors duration-300">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-600 mb-6">
              <Eye size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To become a leading name in South Africa’s workwear industry, known for innovation, reliability, and unmatched customer satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Need gear for your team?</h2>
        <p className="text-muted-foreground mt-2">We'll quote within one working day.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/contact" className="inline-flex h-12 items-center px-6 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors">
            Contact us
          </Link>
          <Link to="/shop" search={{ category: "", q: "" }} className="inline-flex h-12 items-center px-6 border border-input font-semibold rounded-sm hover:bg-accent transition-colors">
            Browse catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
