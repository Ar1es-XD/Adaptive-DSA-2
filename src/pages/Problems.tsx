import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ConceptBadge, DifficultyBadge } from "@/components/Badges";
import { PROBLEMS } from "@/data/problems";
import { useTutorStore, weakestConcept } from "@/lib/store";
import { CONCEPT_LABELS } from "@/lib/types";
import { selectNextProblem } from "@/lib/adaptive";
import { ChevronRight, Target } from "lucide-react";

const Problems = () => {
  const { profile, diagnosticDone } = useTutorStore();
  const recommended = diagnosticDone ? selectNextProblem(profile, []) : null;
  const weak = diagnosticDone ? weakestConcept(profile.scores) : null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-5xl py-10">
        <h1 className="text-3xl font-bold tracking-tight">Problem set</h1>
        <p className="mt-1 text-muted-foreground">{PROBLEMS.length} problems across 4 core concepts.</p>

        {recommended && weak && (
          <Card className="mt-6 border-primary/40 bg-gradient-to-br from-primary/10 to-transparent shadow-glow">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/20 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Recommended next</div>
                  <Link to={`/problems/${recommended.id}`} className="text-base font-semibold hover:text-primary">
                    {recommended.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Selected because you need to improve in <strong className="text-foreground">{CONCEPT_LABELS[weak]}</strong>.
                  </p>
                </div>
              </div>
              <Link to={`/problems/${recommended.id}`} className="inline-flex items-center text-sm text-primary hover:underline">
                Solve <ChevronRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 overflow-hidden rounded-lg border border-border/60 bg-gradient-card shadow-card">
          <table className="w-full">
            <thead className="border-b border-border/60 bg-secondary/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Concept</th>
                <th className="px-4 py-3 text-left font-medium">Difficulty</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {PROBLEMS.map((p) => (
                <tr key={p.id} className="border-b border-border/40 transition-colors hover:bg-secondary/20 last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/problems/${p.id}`} className="font-medium hover:text-primary">{p.title}</Link>
                  </td>
                  <td className="px-4 py-3"><ConceptBadge concept={p.concept} /></td>
                  <td className="px-4 py-3"><DifficultyBadge difficulty={p.difficulty} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/problems/${p.id}`} className="text-sm text-muted-foreground hover:text-primary">
                      Solve →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Problems;
