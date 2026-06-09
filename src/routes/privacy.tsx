import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — AMTMTI" },
      { name: "description", content: "AMTMTI privacy policy and data handling practices." },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 lg:px-8 py-16 lg:py-24">
        <h1 className="text-3xl lg:text-4xl font-bold text-navy">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: June 2026</p>

        <div className="mt-10 space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-navy">Information we collect</h2>
            <p className="mt-2">
              When you register, apply for membership, submit a contact form, or enroll in programs,
              we collect information you provide such as your name, email, profession, and country.
              Authentication data is managed securely through Supabase Auth.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy">How we use your data</h2>
            <p className="mt-2">
              We use your information to deliver educational services, process applications,
              communicate about programs and events, and improve our platform. We do not sell your
              personal data to third parties.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy">Data security</h2>
            <p className="mt-2">
              Data is stored in Supabase with row-level security policies. Access to administrative
              functions is restricted to authorized staff with appropriate roles.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy">Your rights</h2>
            <p className="mt-2">
              You may request access, correction, or deletion of your personal data by contacting{" "}
              <a href="mailto:privacy@amtmti.africa" className="text-medical hover:underline">
                privacy@amtmti.africa
              </a>
              .
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-navy">Contact</h2>
            <p className="mt-2">
              For privacy-related inquiries, email{" "}
              <a href="mailto:privacy@amtmti.africa" className="text-medical hover:underline">
                privacy@amtmti.africa
              </a>{" "}
              or use our contact form.
            </p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
