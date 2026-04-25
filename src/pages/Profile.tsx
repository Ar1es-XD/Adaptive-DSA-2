import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTutorStore, weakestConcept } from "@/lib/store";
import { CONCEPTS, CONCEPT_LABELS, type Concept } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const conceptColor: Record<Concept, string> = {
  arrays: "bg-concept-arrays",
  "two-pointers": "bg-concept-two-pointers",
  "sliding-window": "bg-concept-sliding-window",
  recursion: "bg-concept-recursion",
};

const Profile = () => {
  const { diagnosticDone, profile, plan, setPlan, reset } = useTutorStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!diagnosticDone) navigate("/diagnostic");
  }, [diagnosticDone, navigate]);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: { scores: profile.scores },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPlan(data.plan);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (diagnosticDone && !plan) generatePlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosticDone]);

  const weak = weakestConcept(profile.scores);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-5xl py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your skill profile</h1>
            <p className="mt-1 text-muted-foreground">Based on diagnostic + practice attempts.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { reset(); navigate("/diagnostic"); }}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retake diagnostic
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3 border-border/60 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Concept scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {CONCEPTS.map((c) => {
                const v = profile.scores[c];
                const stats = profile.stats[c];
                return (
                  <div key={c}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{CONCEPT_LABELS[c]}</span>
                      <span className="font-mono text-muted-foreground">
                        {v}% {stats.attempts > 0 && <span className="ml-2 text-xs">({stats.correct}/{stats.attempts})</span>}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className={cn("h-full transition-all", conceptColor[c])} style={{ width: `${v}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="mt-6 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
                <strong className="text-warning">Focus area:</strong> <span className="text-foreground/90">{CONCEPT_LABELS[weak]}</span>
                <span className="text-muted-foreground"> — your lowest-scoring concept. We'll start your practice here.</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                  <Link to="/problems">Start practicing <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/concept/${weak}`}>Learn {CONCEPT_LABELS[weak]}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-border/60 bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI study plan</CardTitle>
              <Button variant="ghost" size="sm" onClick={generatePlan} disabled={loading}>
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Regenerate"}
              </Button>
            </CardHeader>
            <CardContent>
              {loading && !plan ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating your plan...
                </div>
              ) : plan ? (
                <div className="prose prose-sm prose-invert max-w-none [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2 [&_ul]:my-2 [&_li]:text-sm [&_p]:text-sm [&_p]:text-muted-foreground [&_strong]:text-foreground">
                  <ReactMarkdown>{plan}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No plan yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
