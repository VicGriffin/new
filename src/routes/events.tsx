import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/layout";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — AMTMTI" },
      {
        name: "description",
        content: "Upcoming AMTMTI conferences, webinars, and training events.",
      },
      { property: "og:title", content: "AMTMTI Events" },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: Events,
});

function Events() {
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: past } = useQuery({
    queryKey: ["events-past"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .lt("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">
              Events
            </span>
            <h1 className="mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl">
              Conferences, webinars & training
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl">
              Join AMTMTI events across Africa — from virtual CPD sessions to continental conferences.
            </p>
          </div>
          <div className="lg:col-span-6">
            <img
              src="/images/mtm-education.png"
              alt="AMTMTI events and training"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
        <h2 className="text-2xl font-bold text-navy">Upcoming events</h2>
        {isLoading && <p className="mt-6 text-muted-foreground">Loading events…</p>}
        {error && <p className="mt-6 text-destructive">Could not load events.</p>}
        {!isLoading && !events?.length && (
          <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No upcoming events scheduled. Subscribe to our news for announcements.
          </p>
        )}
        <div className="mt-6 space-y-4">
          {events?.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>

        {!!past?.length && (
          <>
            <h2 className="mt-16 text-2xl font-bold text-navy">Past events</h2>
            <div className="mt-6 space-y-4 opacity-80">
              {past.map((ev) => (
                <EventCard key={ev.id} event={ev} past />
              ))}
            </div>
          </>
        )}
      </section>
    </PageShell>
  );
}

function EventCard({
  event,
  past,
}: {
  event: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    starts_at: string;
    ends_at: string | null;
  };
  past?: boolean;
}) {
  const start = new Date(event.starts_at);
  return (
    <article className="rounded-xl border border-border bg-card p-6 flex flex-wrap gap-6">
      <div
        className={`grid place-items-center w-20 h-20 rounded-xl text-white font-bold ${past ? "bg-muted text-muted-foreground" : "bg-navy"}`}
      >
        <div className="text-center">
          <div className="text-xs uppercase">
            {start.toLocaleString("default", { month: "short" })}
          </div>
          <div className="text-2xl">{start.getDate()}</div>
        </div>
      </div>
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-lg font-bold text-navy">{event.title}</h3>
        {event.description && (
          <p className="mt-2 text-sm text-foreground/75">{event.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-medical" />
            {start.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            {event.ends_at && ` – ${new Date(event.ends_at).toLocaleTimeString()}`}
          </span>
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-medical" />
              {event.location}
            </span>
          )}
        </div>
      </div>
      {!past && (
        <div className="self-center">
          <Calendar className="size-8 text-medical/40" />
        </div>
      )}
    </article>
  );
}
