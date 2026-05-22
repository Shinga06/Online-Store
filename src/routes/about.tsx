import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, Factory, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — CBALCOOL PPE & Workwear" },
      { name: "description", content: "CBALCOOL has supplied PPE and workwear to South African industry since 2008 — quality gear, fair pricing, expert service." },
    ],
  }),
});

function AboutPage() {
  return (
    <div>
      <section className="bg-surface text-surface-foreground">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--hi-vis)] mb-4">About CBALCOOL</div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
            Workwear that holds the line — shift after shift, site after site.
          </h1>
          <p className="mt-6 max-w-2xl text-white/75 text-lg">
            CBALCOOL has been outfitting South Africa's industrial, security, hospitality
            and corporate teams since 2008. We focus on one thing: durable, compliant
            gear that performs on the job.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl font-bold">Our story</h2>
          <div className="mt-4 space-y-4 text-foreground/80 leading-relaxed">
            <p>
              We started in a small Johannesburg warehouse with two ranges and a handful
              of mining clients. Today we stock 24 product categories and supply
              hundreds of businesses across South Africa — from single-site contractors
              to national security firms and hotel groups.
            </p>
            <p>
              We don't dilute our range with novelties. Every item we sell is chosen
              for one reason: it earns its place on a real worker, doing a real job,
              every day.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: ShieldCheck, n: "SABS", l: "Approved suppliers" },
            { icon: Users, n: "500+", l: "Business customers" },
            { icon: Factory, n: "24", l: "Product categories" },
            { icon: Award, n: "16 yrs", l: "Serving industry" },
          ].map(({ icon: Icon, n, l }) => (
            <div key={l} className="border border-border rounded-md p-5">
              <Icon size={22} className="text-primary" />
              <div className="text-2xl font-bold mt-3">{n}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">What we stand for</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Compliance first", d: "We only stock gear that meets SABS, EN and ASTM standards relevant to the job." },
              { t: "Honest pricing", d: "Transparent ZAR pricing with proper trade discounts for bulk orders." },
              { t: "Service that answers", d: "Real humans in Johannesburg. We respond within one working day." },
            ].map((v) => (
              <div key={v.t} className="bg-card border border-border rounded-md p-6">
                <div className="font-semibold">{v.t}</div>
                <p className="text-sm text-muted-foreground mt-2">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Need gear for your team?</h2>
        <p className="text-muted-foreground mt-2">We'll quote within one working day.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/contact" className="inline-flex h-12 items-center px-6 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90">
            Contact us
          </Link>
          <Link to="/shop" search={{ category: "", q: "" }} className="inline-flex h-12 items-center px-6 border border-input font-semibold rounded-sm hover:bg-accent">
            Browse catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
