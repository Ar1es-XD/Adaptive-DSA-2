import { useParams, Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONCEPT_CONTENT } from "@/data/concepts";
import type { Concept as ConceptType } from "@/lib/types";
import { ArrowLeft, Lightbulb, Target, BookOpen, Code } from "lucide-react";

const Concept = () => {
  const { concept } = useParams<{ concept: ConceptType }>();
  const data = concept ? CONCEPT_CONTENT[concept] : undefined;

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container max-w-3xl py-10">
          <p>Concept not found.</p>
          <Button asChild variant="outline" className="mt-4"><Link to="/problems">Back</Link></Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-3xl py-10">
        <Link to="/problems" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to problems
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{data.title}</h1>

        <Card className="mt-6 border-border/60 bg-gradient-card shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="h-4 w-4 text-warning" /> Intuition</CardTitle></CardHeader>
          <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{data.intuition}</p></CardContent>
        </Card>

        <Card className="mt-4 border-border/60 bg-gradient-card shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Target className="h-4 w-4 text-info" /> When to use</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {data.whenToUse.map((w, i) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{w}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-4 border-border/60 bg-gradient-card shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="h-4 w-4 text-accent" /> Walkthrough</CardTitle></CardHeader>
          <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{data.walkthrough}</p></CardContent>
        </Card>

        <Card className="mt-4 border-border/60 bg-gradient-card shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Code className="h-4 w-4 text-primary" /> Code skeleton</CardTitle></CardHeader>
          <CardContent>
            <pre className="overflow-auto rounded-md border border-border/60 bg-background/50 p-4 text-xs leading-relaxed font-mono">
              <code>{data.skeleton}</code>
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Concept;
