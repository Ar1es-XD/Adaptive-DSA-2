import { Link } from "react-router-dom";
import { CONCEPTS, CONCEPT_LABELS, type Concept } from "@/lib/types";
import { useTutorStore, weakestConcept } from "@/lib/store";
import { ArrowRight, PlayCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

import { CONCEPT_CONTENT } from "@/data/concepts";


const Concepts = () => {
  const { profile, diagnosticDone } = useTutorStore();
  const weak = diagnosticDone ? weakestConcept(profile.scores) : null;

  return (
    <div className="bg-background min-h-full font-sans">
      <main className="container max-w-6xl py-16">

        {/* Header */}
        <div className="mb-20">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-6">Learning Catalogue</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-pixel uppercase mb-8 leading-tight">
            Core <span className="text-primary">Concepts</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
            Deep-dive into each algorithmic pattern. Read the theory, understand the intuition, then reinforce it by solving targeted problems.
          </p>
        </div>

        {/* Concept Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {CONCEPTS.map((concept, i) => {
            const isWeak = concept === weak;
            return (
              <Link
                key={concept}
                to={`/concept/${concept}`}
                className={cn(
                  "group block border-4 border-foreground rounded-[3rem] overflow-hidden bg-card transition-all duration-300",
                  "shadow-[10px_10px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2",
                )}
              >
                {/* Image */}
                <div className="h-56 relative overflow-hidden border-b-4 border-foreground">
                  <img
                    src={(CONCEPT_CONTENT as any)[concept]?.image ?? "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800"}
                    alt={CONCEPT_LABELS[concept]}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Index number */}
                  <div className="absolute top-6 left-8 font-pixel text-4xl font-black text-white/40">
                    0{i + 1}
                  </div>

                  {/* Weak badge */}
                  {isWeak && (
                    <div className="absolute top-6 right-6 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border-2 border-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      Priority Focus
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-10">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors">
                      {CONCEPT_LABELS[concept]}
                    </h2>
                    {diagnosticDone && (
                      <div className="text-right shrink-0">
                        <div className="text-3xl font-black font-pixel text-primary">{profile.scores[concept]}%</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mastery</div>
                      </div>
                    )}
                  </div>

                  <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                    {(CONCEPT_CONTENT as any)[concept]?.tagline ?? CONCEPT_LABELS[concept]}
                  </p>

                  {diagnosticDone && (
                    <div className="mb-8">
                      <div className="h-4 w-full bg-muted rounded-full overflow-hidden border-2 border-foreground">
                        <div
                          className="h-full bg-primary transition-all duration-700"
                          style={{ width: `${profile.scores[concept]}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-base font-black uppercase tracking-widest text-primary group-hover:gap-5 transition-all">
                    <BookOpen className="h-5 w-5" />
                    Study Concept
                    <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-24 bg-foreground text-background rounded-[3rem] p-16 border-4 border-foreground shadow-[12px_12px_0_0_#bf2f1f] flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter font-pixel mb-4">
              Ready to <span className="text-primary">practise?</span>
            </h2>
            <p className="text-lg opacity-80 font-medium">Turn theory into muscle memory with our curated problem set.</p>
          </div>
          <Link
            to="/problems"
            className="h-16 px-12 rounded-2xl bg-primary text-white border-4 border-foreground font-bold text-lg shadow-[6px_6px_0_0_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-3 shrink-0"
          >
            <PlayCircle className="h-6 w-6" />
            Open Problem Set
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Concepts;
