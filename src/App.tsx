import React, { useEffect, useMemo, useRef, useState } from "react";

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.05, 0.1, 0.2, 0.35, 0.5] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join("|")]);

  return active;
}


function GlowCursor() {
  // subtle glow that follows mouse (keeps the Blackswan feel)
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background:
          "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), var(--cursor-color, rgba(160,100,255,0.18)), transparent 45%)",
      }}
    />
  );
}

function SectionTitle({ kicker, title, desc }: { kicker: string; title: React.ReactNode; desc?: string }) {
  return (
    <div className="mb-10">
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white/95 text-center">{title}</h2>
      {desc ? <p className="mt-2 text-white/55 max-w-2xl">{desc}</p> : null}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
      {children}
    </span>
  );
}

export default function App() {
  const pdfBasePath = `${import.meta.env.BASE_URL}pdfs/`;

  return (
    <div id="top" className="min-h-screen bg-black relative overflow-hidden">
      <GlowCursor />
      <div className="noise" />
      <header className="relative z-10 pt-36 md:pt-44">
        <div className="relative px-6 md:px-10 py-14 md:py-50"> </div>
        <div className="container-max">
          <div className="relative px-6 md:px-10 py-14 md:py-20">
              {/* big outline word */}
              <div className="absolute inset-x-0 top-4/5 transform -translate-y-1/2 text-center select-none pointer-events-none">
                <div className="big-outline font-black text-[74px] md:text-[140px] leading-none opacity-80">
                  MARCO ZAMBONI
                </div>
              </div>
            </div>
        </div>
      </header>

      {/* PROJECTS */}
      <section id="projects" className="relative z-10 pt-20 md:pt-28">
        <div className="container-max">
          <SectionTitle
            kicker="Projects"
            title={<>Some of my latest <span className="text-accent hover:glow transition">Projects</span>, take a look.</>}
          />

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Recovering the Risk‑Neutral Density Across Maturities",
                desc: "Recovering risk-neutral densities from option prices using SVI volatility surface calibration and the Breeden–Litzenberger formula. Validated on synthetic data and applied to S&P 500 options.",
                tags: [ "Python - TeX", "Options", "SVI", "Breeden–Litzenberger Formula"],
                pdf: `${pdfBasePath}Article.pdf`,
                repo: "https://github.com/MarcoZambonii/Recovering_the-Risk-Neutral_Density"
              },
              {
                title: "Probability Book",
                desc: "A rewritten version of the Probability course for Mathematical Engineering at Politecnico di Milano, designed to present the core concepts of probability theory in a clear and structured way.",
                tags: ["TeX", "Book", "PoliMi"],
                pdf: `${pdfBasePath}Dispense_Probabilita.pdf`,
                repo: "https://github.com/MarcoZambonii/Dispense-Probabilita"
              },
              {
                title: "Theory-Driven vs Data-Driven Models: A Comparison in Demand Forecasting",
                desc: "A study comparing theory-driven and data-driven approaches to demand forecasting, developed as an industry thesis project in collaboration with Politecnico di Milano.",
                tags: ["Python - TeX", "PoliMi", "Demand Forecasting"],
                pdf: `${pdfBasePath}demand-forecast.pdf`,
                repo: "https://github.com/marcozamboni/demand-forecast",
                wip: true
              },

            ].map((p) => (
              <div
              key={p.title}
              className={cn("card p-6 transition flex flex-col h-full", p.wip ? "hover:border-red-500/20" : "hover:border-white/20")}
              onMouseEnter={p.wip ? () => document.body.classList.add("cursor-red") : undefined}
              onMouseLeave={p.wip ? () => document.body.classList.remove("cursor-red") : undefined}
            >
                <div>
                  <div className="text-white/90 font-medium">{p.title}</div>
                  <p className="mt-2 text-white/55 text-sm">{p.desc}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t, idx) => (
                    <span
                      key={t}
                      className={`text-xs px-2.5 py-1 rounded-full transition ${
                        idx === 0
                          ? "border border-white/10 bg-white/5 text-white/70 tag-glow"
                          : "border border-white/10 bg-white/5 text-white/70"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.wip ? (
                  <div className="mt-auto pt-8 flex justify-center">
                    <div className="px-4 py-2 rounded-xl border border-white/12 text-white/75 flex items-center gap-2 cursor-default opacity-80 glow-button">
                      <svg className="w-4 h-4 animate-spin [animation-duration:2s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
                      </svg>
                      <span className="italic text-sm">work in progress</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto pt-8 flex justify-center gap-2">
                    <a
                      href={p.pdf}
                      className="px-4 py-2 rounded-xl border border-white/12 text-white/75 hover:text-white hover:border-white/20 transition flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M16 13h-4" />
                        <path d="M14 11v4" />
                      </svg>
                      PDF
                    </a>
                    <a
                      href={p.repo}
                      className="px-4 py-2 rounded-xl border border-white/12 text-white/75 hover:text-white hover:border-white/20 transition flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      GitHub
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="relative z-10 pt-20 md:pt-28">
        <div className="container-max">
          <SectionTitle
            kicker="Events"
            title="A simple timeline."
            desc="Keep it short. Blackswan style is minimal."
          />

          <div className="card p-6">
            <div className="space-y-5">
              {[
                { date: "2026‑04‑10", title: "Talk: Vol surfaces", where: "Milan" },
                { date: "2026‑05‑02", title: "Workshop: RND extraction", where: "Online" },
                { date: "2026‑06‑18", title: "Meetup: Quant tooling", where: "Amsterdam" },
              ].map((e) => (
                <div key={e.title} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white/85 font-medium">{e.title}</div>
                    <div className="text-white/50 text-sm mt-1">{e.where}</div>
                  </div>
                  <div className="text-white/45 text-sm">{e.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-6 md:py-8">
        <div className="container-max">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex gap-4">
<a href="mailto:marco1.zamboni@mail.polimi.it" className="text-white/60 hover:text-accent transition" target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>
              <a href="https://github.com/MarcoZambonii" className="text-white/60 hover:text-accent transition" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/marco-zamboni-659881282/" className="text-white/60 hover:text-accent transition" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
<a href="https://www.instagram.com/marco_zambonii/" className="text-white/60 hover:text-accent transition" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
            <a
              href="#top"
              className="self-start md:self-auto px-4 py-2 rounded-xl border border-white/12 text-white/75 hover:text-white hover:border-white/20 transition"
            >
              Back to top
            </a>
          </div>
          <div className="mt-6 text-center text-white/35 text-xs">
            © {new Date().getFullYear()} Marco Zamboni — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
