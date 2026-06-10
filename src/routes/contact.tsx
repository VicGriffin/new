import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/layout";
import { imageUrl } from "@/lib/utils";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AMTMTI" },
      {
        name: "description",
        content: "Get in touch with the Africa Medication Therapy Management Training Institute.",
      },
      { property: "og:title", content: "Contact AMTMTI" },
      { property: "og:description", content: "Email, phone, address, and inquiry form." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Admissions",
    organization: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("contacts").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      organization: form.organization || null,
      message: form.message,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", subject: "Admissions", organization: "", message: "" });
  }
  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imageUrl("contact_hero.jfif")}
            alt="Contact AMTMTI"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/15 to-navy/95" aria-hidden />
        </div>
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">
            Contact
          </span>
          <h1 className="mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl">
            Let's build a healthier Africa together.
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-2xl">
            Admissions, partnerships, research collaboration, media — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-5">
          {[
            { icon: Mail, l: "Email", v: "admissions@amtmti.africa" },
            { icon: Phone, l: "Phone", v: "+254 20 000 0000" },
            { icon: MapPin, l: "Office", v: "AMTMTI House, Westlands, Nairobi, Kenya" },
          ].map((c) => (
            <div key={c.l} className="flex gap-4 rounded-2xl bg-card border border-border p-5">
              <div className="size-11 shrink-0 rounded-lg bg-medical/10 text-medical grid place-items-center">
                <c.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-medical">{c.l}</p>
                <p className="mt-0.5 font-semibold text-navy">{c.v}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3]">
            <iframe
              title="AMTMTI location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=36.7900%2C-1.2780%2C36.8200%2C-1.2600&layer=mapnik"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="rounded-2xl bg-card border border-border p-6 lg:p-8 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Name" required>
                <input
                  required
                  maxLength={100}
                  className={inp}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Email" required>
                <input
                  required
                  type="email"
                  maxLength={200}
                  className={inp}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Inquiry type" required>
                <select
                  required
                  className={inp}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  {["Admissions", "Partnership", "Research", "Media", "Other"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Organization">
                <input
                  maxLength={150}
                  className={inp}
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Message" required>
              <textarea
                required
                rows={6}
                maxLength={2000}
                className={`${inp} resize-none`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Field>
            <button
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3.5 font-semibold text-white hover:bg-medical/90 disabled:opacity-60"
            >
              <Send className="size-4" /> {sending ? "Sending…" : "Send message"}
            </button>
            {sent && (
              <p className="text-sm text-emerald-brand font-semibold">
                Thanks — your message is on its way.
              </p>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}

const inp =
  "w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical";
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy">
        {label}
        {required && <span className="text-medical"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
