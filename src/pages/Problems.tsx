import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConceptBadge, DifficultyBadge } from "@/components/Badges";
import { PROBLEMS } from "@/data/problems";
import { useTutorStore, weakestConcept } from "@/lib/store";
import { CONCEPTS, CONCEPT_LABELS, type Concept, type Difficulty } from "@/lib/types";
import { selectNextProblem } from "@/lib/adaptive";
import { cn } from "@/lib/utils";
import { ChevronRight, Target, Filter, X } from "lucide-react";

type StatusFilter = "all" | "solved" | "unsolved";
type SortBy = "default" | "difficulty-asc" | "difficulty-desc" | "alpha";

const Problems = () => {
  const { profile, diagnosticDone } = useTutorStore();
  const solvedIds: string[] = profile.solvedIds ?? [];
  const weak = diagnosticDone ? weakestConcept(profile.scores) : null;
  const recommended = diagnosticDone ? selectNextProblem(profile, solvedIds) : null;

  const [searchParams] = useSearchParams();
  const initConcept = (searchParams.get("concept") as Concept | null) ?? "all";
  const initDiff = (searchParams.get("difficulty") as Difficulty | null) ?? "all";

  const [conceptFilter, setConceptFilter] = useState<Concept | "all">(initConcept);
  const [diffFilter, setDiffFilter] = useState<Difficulty | "all">(initDiff);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("default");

  const filtered = useMemo(() => {
    let list = [...PROBLEMS];
    if (conceptFilter !== "all") list = list.filter(p => p.concept === conceptFilter);
    if (diffFilter !== "all") list = list.filter(p => p.difficulty === diffFilter);
    if (statusFilter === "solved") list = list.filter(p => solvedIds.includes(p.id));
    if (statusFilter === "unsolved") list = list.filter(p => !solvedIds.includes(p.id));
    if (sortBy === "difficulty-asc") list.sort((a, b) => a.difficulty === b.difficulty ? 0 : a.difficulty === "easy" ? -1 : 1);
    if (sortBy === "difficulty-desc") list.sort((a, b) => a.difficulty === b.difficulty ? 0 : a.difficulty === "medium" ? -1 : 1);
    if (sortBy === "alpha") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [conceptFilter, diffFilter, statusFilter, sortBy, solvedIds]);

  const hasFilters = conceptFilter !== "all" || diffFilter !== "all" || statusFilter !== "all";
  const clearFilters = () => { setConceptFilter("all"); setDiffFilter("all"); setStatusFilter("all"); setSortBy("default"); };

  return (
    <div className="bg-background min-h-full text-foreground font-sans">
      <main className="container max-w-6xl py-12">
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter font-pixel uppercase mb-3">Problem Set</h1>
          <p className="text-lg text-muted-foreground font-medium">
            {PROBLEMS.length} problems · {solvedIds.length} solved · {CONCEPTS.length} topics
          </p>
        </div>

        {/* Recommended */}
        {recommended && weak && (
          <Card className="mb-10 border-4 border-foreground bg-primary/5 rounded-[2.5rem] shadow-[10px_10px_0_0_#bf2f1f] overflow-hidden">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 p-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-foreground">
                  <Target className="h-8 w-8" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-primary mb-1">Recommended Next</div>
                  <Link to={`/problems/${recommended.id}`} className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors block">
                    {recommended.title}
                  </Link>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    Targets your weak area: <strong className="text-foreground">{CONCEPT_LABELS[weak]}</strong>
                  </p>
                </div>
              </div>
              <Button asChild className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold border-2 border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all shrink-0">
                <Link to={`/problems/${recommended.id}`}>Solve <ChevronRight className="ml-1 h-5 w-5" /></Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filter Bar */}
        <div className="bg-card border-4 border-foreground rounded-2xl p-6 mb-8 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
              <Filter className="h-4 w-4 text-primary" /> Filters
            </div>

            {/* Topic */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setConceptFilter("all")} className={cn("px-3 py-1.5 rounded-xl border-2 border-foreground text-xs font-bold uppercase tracking-wider transition-all", conceptFilter === "all" ? "bg-foreground text-background" : "bg-background hover:bg-secondary")}>All</button>
              {CONCEPTS.map(c => (
                <button key={c} onClick={() => setConceptFilter(c === conceptFilter ? "all" : c)}
                  className={cn("px-3 py-1.5 rounded-xl border-2 border-foreground text-xs font-bold uppercase tracking-wider transition-all", conceptFilter === c ? "bg-primary text-primary-foreground" : "bg-background hover:bg-secondary")}>
                  {CONCEPT_LABELS[c]}
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-foreground/20 hidden md:block" />

            {/* Difficulty */}
            {(["all","easy","medium"] as const).map(d => (
              <button key={d} onClick={() => setDiffFilter(d)}
                className={cn("px-3 py-1.5 rounded-xl border-2 border-foreground text-xs font-bold uppercase tracking-wider transition-all",
                  diffFilter === d ? "bg-foreground text-background" : "bg-background hover:bg-secondary")}>
                {d === "all" ? "Any Difficulty" : d}
              </button>
            ))}

            <div className="w-px h-8 bg-foreground/20 hidden md:block" />

            {/* Status */}
            {(["all","unsolved","solved"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("px-3 py-1.5 rounded-xl border-2 border-foreground text-xs font-bold uppercase tracking-wider transition-all",
                  statusFilter === s ? "bg-foreground text-background" : "bg-background hover:bg-secondary")}>
                {s === "all" ? "Any Status" : s}
              </button>
            ))}

            {hasFilters && (
              <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/70 transition-colors uppercase tracking-widest">
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Problem Table */}
        <div className="overflow-hidden rounded-[2.5rem] border-4 border-foreground bg-card shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
          {filtered.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground font-bold text-lg">
              No problems match your filters.
              <button onClick={clearFilters} className="ml-2 text-primary underline">Clear filters</button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-4 border-foreground bg-secondary">
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest font-pixel">Status</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest font-pixel">Title</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest font-pixel">Pattern</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest font-pixel">Difficulty</th>
                  <th className="px-8 py-5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isSolved = solvedIds.includes(p.id);
                  return (
                    <tr key={p.id} className="border-b-2 border-foreground/10 hover:bg-secondary/50 last:border-0 group transition-colors">
                      <td className="px-8 py-5">
                        <div className={cn("h-4 w-4 rounded-full border-2 border-foreground transition-colors",
                          isSolved ? "bg-green-500 shadow-[2px_2px_0_0_rgba(0,0,0,1)]" : "bg-muted")} />
                      </td>
                      <td className="px-8 py-5">
                        <Link to={`/problems/${p.id}`} className="text-lg font-bold uppercase tracking-tight hover:text-primary transition-colors">{p.title}</Link>
                      </td>
                      <td className="px-8 py-5"><ConceptBadge concept={p.concept} /></td>
                      <td className="px-8 py-5"><DifficultyBadge difficulty={p.difficulty} /></td>
                      <td className="px-8 py-5 text-right">
                        <Link to={`/problems/${p.id}`} className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-primary hover:gap-2 transition-all">
                          Solve <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 text-sm text-muted-foreground font-medium text-right">
          Showing {filtered.length} of {PROBLEMS.length} problems
        </div>
      </main>
    </div>
  );
};

export default Problems;
