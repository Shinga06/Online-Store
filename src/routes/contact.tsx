import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — SafeGear PPE & Workwear" },
      { name: "description", content: "Get in touch with SafeGear for quotes, bulk orders, and branded workwear. Johannesburg, South Africa." },
    ],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Contact</div>
      <h1 className="text-3xl md:text-4xl font-bold">Talk to our team</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        Quotes, bulk orders, branding and uniform programs — we'll respond within one working day.
      </p>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 mt-12">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Message sent. We'll be in touch shortly.");
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" name="name" required />
            <Field label="Company" name="company" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" />
          </div>
          <Field label="Subject" name="subject" required />
          <label className="block">
            <span className="text-xs font-medium text-foreground/80">Message</span>
            <textarea
              name="message"
              required
              rows={6}
              className="mt-1 w-full px-3 py-2 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="h-12 px-8 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90"
          >
            Send message
          </button>
          {sent && (
            <p className="text-sm text-primary">Thanks — your message is in. We'll reply by email.</p>
          )}
        </form>

        <aside className="bg-surface text-surface-foreground rounded-md p-6 h-fit">
          <div className="text-xs uppercase tracking-[0.18em] text-white/60 mb-4">Get in touch directly</div>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <Phone size={18} className="text-[var(--hi-vis)] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">+27 (0)11 555 0100</div>
                <div className="text-white/70 text-xs">Sales & support</div>
              </div>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-[var(--hi-vis)] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">sales@safegear.co.za</div>
                <div className="text-white/70 text-xs">Quotes & orders</div>
              </div>
            </li>
            <li className="flex gap-3">
              <MapPin size={18} className="text-[var(--hi-vis)] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Industrial Way, Johannesburg</div>
                <div className="text-white/70 text-xs">Gauteng, South Africa</div>
              </div>
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="text-[var(--hi-vis)] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Mon–Fri · 08:00–17:00</div>
                <div className="text-white/70 text-xs">Closed weekends & public holidays</div>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-foreground/80">{label}</span>
      <input
        {...props}
        className="mt-1 w-full h-10 px-3 border border-input rounded-sm bg-background text-sm focus:outline-none focus:border-primary"
      />
    </label>
  );
}
