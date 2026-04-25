import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ConceptBadge } from "@/components/Badges";
import { CodeEditor } from "@/components/CodeEditor";
import { DIAGNOSTIC_QUESTIONS } from "@/data/diagnostic";
import { useTutorStore } from "@/lib/store";
import { CONCEPTS, type Concept, type DiagnosticEvaluation, type Language } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowRight, Brain, Code2, Lightbulb, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const kindMeta = {
  logical: { label: "Logical reasoning", icon: Brain, tone: "text-primary" },
  conceptual: { label: "Conceptual", icon: Lightbulb, tone: "text-warning" },
  coding: { label: "Coding", icon: Code2, tone: "text-success" },
} as const;

const understandingScore = (u: DiagnosticEvaluation["understanding"]) =>
  u === "high" ? 100 : u === "medium" ? 60 : 20;

const Diagnostic = () => {
  const navigate = useNavigate();
  const setDiagnostic = useTutorStore((s) => s.setDiagnostic);

  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<Record<string, DiagnosticEvaluation>>({});
  const [currentEval, setCurrentEval] = useState<DiagnosticEvaluation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const q = DIAGNOSTIC_QUESTIONS[idx];
  const isLast = idx === DIAGNOSTIC_QUESTIONS.length - 1;
  const Meta = kindMeta[q.kind];
  const Icon = Meta.icon;

  // Reset per-question state when moving to a new question
  const goToQuestion = (newIdx: number) => {
    const next = DIAGNOSTIC_QUESTIONS[newIdx];
    setIdx(newIdx);
    setAnswer(next.kind === "coding" ? next.starter ?? "" : "");
    setReasoning("");
    setCurrentEval(null);
  };

  // Initialize starter for the very first coding question
  useMemo(() => {
    if (q.kind === "coding" && answer === "") setAnswer(q.starter ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canEvaluate =
    answer.trim().length > 1 && (q.kind === "coding" || reasoning.trim().length > 1);

  const evaluate = async () => {
    if (!canEvaluate) return;
    setEvaluating(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-diagnostic", {
        body: {
          kind: q.kind,
          concept: q.concept,
          prompt: q.prompt,
          referenceAnswer: q.referenceAnswer,
          referenceReasoning: q.referenceReasoning,
          userAnswer: answer,
          userReasoning: q.kind === "coding" ? "" : reasoning,
          language: q.language,
        },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      const evalResult = data as DiagnosticEvaluation;
      setCurrentEval(evalResult);
      setEvaluations((prev) => ({ ...prev, [q.id]: evalResult }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Evaluation failed");
    } finally {
      setEvaluating(false);
    }
  };

  const finish = () => {
    setSubmitting(true);
    // Aggregate per-concept score from all evaluations
    const sums = CONCEPTS.reduce(
      (acc, c) => ({ ...acc, [c]: { total: 0, count: 0 } }),
      {} as Record<Concept, { total: number; count: number }>,
    );
    DIAGNOSTIC_QUESTIONS.forEach((qq) => {
      const ev = evaluations[qq.id];
      if (!ev) return;
      const base = ev.correct ? understandingScore(ev.understanding) : Math.min(30, understandingScore(ev.understanding));
      sums[qq.concept].total += base;
      sums[qq.concept].count += 1;
    });
    const scores = CONCEPTS.reduce((acc, c) => {
      // Untested concepts default to a neutral 50 (not a false weakness)
      acc[c] = sums[c].count > 0 ? Math.round(sums[c].total / sums[c].count) : 50;
      return acc;
    }, {} as Record<Concept, number>);
    setDiagnostic(scores);
    navigate("/profile");
  };

  const next = () => {
    if (isLast) {
      finish();
    } else {
      goToQuestion(idx + 1);
    }
  };

  const progress = ((idx + (currentEval ? 1 : 0)) / DIAGNOSTIC_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-3xl py-10">
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {idx + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <Icon className={cn("h-3 w-3", Meta.tone)} />
              {Meta.label}
            </Badge>
            <ConceptBadge concept={q.concept} />
          </div>
        </div>
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <Card className="border-border/60 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-lg leading-snug">{q.prompt}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {q.kind === "coding" ? (
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Your code ({q.language})
                </label>
                <CodeEditor
                  value={answer}
                  onChange={setAnswer}
                  language={(q.language as Language) ?? "python"}
                  height={260}
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Your answer
                  </label>
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Write your answer in your own words..."
                    className="min-h-[100px] resize-y bg-secondary/30 text-sm"
                    disabled={evaluating || !!currentEval}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Your reasoning
                  </label>
                  <Textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    placeholder="Why does your answer work? What's the intuition?"
                    className="min-h-[80px] resize-y bg-secondary/30 text-sm"
                    disabled={evaluating || !!currentEval}
                  />
                </div>
              </>
            )}

            {currentEval && (
              <div
                className={cn(
                  "rounded-md border p-4 text-sm",
                  currentEval.correct
                    ? "border-success/40 bg-success/5"
                    : currentEval.understanding === "medium"
                    ? "border-warning/40 bg-warning/5"
                    : "border-destructive/40 bg-destructive/5",
                )}
              >
                <div className="mb-2 flex items-center gap-2 font-medium">
                  {currentEval.correct ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : currentEval.understanding === "medium" ? (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span>
                    {currentEval.correct ? "Correct" : "Not quite"}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      · understanding: {currentEval.understanding}
                    </span>
                  </span>
                </div>
                <p className="text-muted-foreground">{currentEval.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          {!currentEval ? (
            <Button
              onClick={evaluate}
              disabled={!canEvaluate || evaluating}
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            >
              {evaluating ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Evaluating...
                </>
              ) : (
                "Submit answer"
              )}
            </Button>
          ) : (
            <Button
              onClick={next}
              disabled={submitting}
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            >
              {isLast ? "See your profile" : "Next question"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Diagnostic;
