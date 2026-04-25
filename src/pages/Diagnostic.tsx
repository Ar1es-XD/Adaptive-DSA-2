import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/CodeEditor";
import { DIAGNOSTIC_QUESTIONS } from "@/data/diagnostic";
import { useTutorStore } from "@/lib/store";
import { CONCEPTS, type Concept, type DiagnosticEvaluation, type Language } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Brain,
  Code2,
  Lightbulb,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

// ---------- helpers ----------

const phaseMeta = {
  logical: { label: "Logical reasoning", icon: Brain },
  conceptual: { label: "Concept understanding", icon: Lightbulb },
  coding: { label: "Coding", icon: Code2 },
} as const;

const understandingLabel = (u: DiagnosticEvaluation["understanding"]) =>
  u === "high" ? "Strong" : u === "medium" ? "Solid" : "Basic";

const understandingScore = (u: DiagnosticEvaluation["understanding"]) =>
  u === "high" ? 100 : u === "medium" ? 60 : 20;

const statusToScoreFactor = (s: DiagnosticEvaluation["status"]) =>
  s === "correct" ? 1 : s === "partial" ? 0.55 : 0.2;

// Coding-question placeholder hints (small inline mentor nudge)
const CODING_HINTS: Record<string, string> = {
  q4: "// Think about how you'd track the current maximum as you walk through the list",
  q5: "// Try walking through pairs (i, i+1) — what's the simplest check?",
};

const CODING_SUBLABEL: Record<string, string> = {
  q4: "Tests basic iteration and tracking a running value.",
  q5: "Tests pair iteration and a simple condition.",
};

// ---------- component ----------

const Diagnostic = () => {
  const navigate = useNavigate();
  const setDiagnostic = useTutorStore((s) => s.setDiagnostic);

  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<Record<string, DiagnosticEvaluation>>({});
  const [currentEval, setCurrentEval] = useState<DiagnosticEvaluation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const q = DIAGNOSTIC_QUESTIONS[idx];
  const isLast = idx === DIAGNOSTIC_QUESTIONS.length - 1;
  const Phase = phaseMeta[q.kind];
  const PhaseIcon = Phase.icon;

  const goToQuestion = (newIdx: number) => {
    const next = DIAGNOSTIC_QUESTIONS[newIdx];
    setIdx(newIdx);
    setAnswer(next.kind === "coding" ? next.starter ?? "" : "");
    setReasoning("");
    setCurrentEval(null);
  };

  // Initialize starter on first coding question
  useEffect(() => {
    if (started && q.kind === "coding" && answer === "") setAnswer(q.starter ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

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
    const sums = CONCEPTS.reduce(
      (acc, c) => ({ ...acc, [c]: { total: 0, count: 0 } }),
      {} as Record<Concept, { total: number; count: number }>,
    );
    DIAGNOSTIC_QUESTIONS.forEach((qq) => {
      const ev = evaluations[qq.id];
      if (!ev) return;
      const base = Math.round(understandingScore(ev.understanding) * statusToScoreFactor(ev.status));
      sums[qq.concept].total += base;
      sums[qq.concept].count += 1;
    });
    const scores = CONCEPTS.reduce((acc, c) => {
      acc[c] = sums[c].count > 0 ? Math.round(sums[c].total / sums[c].count) : 50;
      return acc;
    }, {} as Record<Concept, number>);
    setDiagnostic(scores);
    navigate("/profile");
  };

  const next = () => {
    if (isLast) finish();
    else goToQuestion(idx + 1);
  };

  // ---------- intro ----------

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container max-w-2xl py-16">
          <Card className="border-border/60 bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">A quick diagnostic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                This takes about 2 minutes. No trick questions — we just want to see how you think.
              </p>
              <div className="grid grid-cols-3 gap-3 text-left">
                {(["logical", "conceptual", "coding"] as const).map((k) => {
                  const M = phaseMeta[k];
                  const Icon = M.icon;
                  return (
                    <div key={k} className="rounded-lg border border-border/60 p-3">
                      <Icon className="mb-1.5 h-4 w-4 text-muted-foreground" />
                      <div className="text-xs font-medium">{M.label}</div>
                    </div>
                  );
                })}
              </div>
              <Button
                size="lg"
                onClick={() => setStarted(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start diagnostic
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // ---------- phased progress ----------

  const phases = [
    { key: "logical" as const, count: DIAGNOSTIC_QUESTIONS.filter((x) => x.kind === "logical").length },
    { key: "conceptual" as const, count: DIAGNOSTIC_QUESTIONS.filter((x) => x.kind === "conceptual").length },
    { key: "coding" as const, count: DIAGNOSTIC_QUESTIONS.filter((x) => x.kind === "coding").length },
  ];

  const completedPerPhase = phases.map((p) => {
    const inPhase = DIAGNOSTIC_QUESTIONS.filter((x) => x.kind === p.key);
    const completed = inPhase.filter((x, i) => {
      const globalIdx = DIAGNOSTIC_QUESTIONS.findIndex((q) => q.id === x.id);
      return globalIdx < idx || (globalIdx === idx && currentEval);
    }).length;
    return { ...p, completed };
  });

  // ---------- question screen ----------

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-3xl py-10">
        {/* Phased progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {idx + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
          </div>
          <div className="flex gap-2">
            {completedPerPhase.map((p) => {
              const M = phaseMeta[p.key];
              const Icon = M.icon;
              const pct = (p.completed / p.count) * 100;
              const isActive = q.kind === p.key;
              return (
                <div key={p.key} className="flex-1">
                  <div
                    className={cn(
                      "mb-1.5 flex items-center gap-1.5 text-[11px] font-medium",
                      isActive ? "text-foreground" : "text-muted-foreground/70",
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {M.label}
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full transition-all",
                        pct === 100 ? "bg-success" : isActive ? "bg-primary" : "bg-muted-foreground/30",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question card */}
        <Card className="border-border/60 bg-card">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <PhaseIcon className="h-3.5 w-3.5" />
              {Phase.label}
            </div>
            <CardTitle className="text-lg leading-snug font-normal text-foreground/95 whitespace-pre-line">
              {q.prompt}
            </CardTitle>
            {q.kind !== "coding" && !currentEval && (
              <p className="pt-1 text-xs italic text-muted-foreground">
                Take a moment to think before answering.
              </p>
            )}
            {q.kind === "coding" && (
              <p className="pt-1 text-xs text-muted-foreground">
                {CODING_SUBLABEL[q.id] ?? "We're looking at your approach, not perfect code."}
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-5">
            {q.kind === "coding" ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
                    Your code · {q.language}
                  </label>
                </div>
                <CodeEditor
                  value={answer}
                  onChange={setAnswer}
                  language={(q.language as Language) ?? "python"}
                  height={260}
                />
                {CODING_HINTS[q.id] && (
                  <p className="mt-2 font-mono text-xs text-muted-foreground/80">
                    {CODING_HINTS[q.id]}
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* Reasoning is the headline input — listed first to feel important */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                    Your thinking
                  </label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Walk through how you got there. This matters most.
                  </p>
                  <Textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    placeholder="Why does your answer work? What's the intuition?"
                    className="min-h-[110px] resize-y bg-background text-sm"
                    disabled={evaluating || !!currentEval}
                  />
                </div>

                <div className="border-t border-border/40 pt-4">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Short answer
                  </label>
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="A one-liner conclusion..."
                    className="min-h-[60px] resize-y bg-background text-sm"
                    disabled={evaluating || !!currentEval}
                  />
                </div>
              </>
            )}

            {currentEval && <EvaluationDisplay ev={currentEval} />}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          {!currentEval ? (
            <Button
              onClick={evaluate}
              disabled={!canEvaluate || evaluating}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {evaluating ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Reviewing...
                </>
              ) : (
                "Submit answer"
              )}
            </Button>
          ) : (
            <Button
              onClick={next}
              disabled={submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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

// ---------- evaluation panel ----------

const statusMeta = {
  correct: {
    label: "Correct",
    Icon: CheckCircle2,
    badgeClass: "bg-success/15 text-success border-success/30",
    panelClass: "border-success/30",
  },
  partial: {
    label: "Almost there",
    Icon: AlertCircle,
    badgeClass: "bg-warning/15 text-warning border-warning/30",
    panelClass: "border-warning/30",
  },
  incorrect: {
    label: "Needs work",
    Icon: XCircle,
    badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
    panelClass: "border-destructive/30",
  },
} as const;

const EvaluationDisplay = ({ ev }: { ev: DiagnosticEvaluation }) => {
  const M = statusMeta[ev.status];
  const Icon = M.Icon;
  return (
    <div className={cn("rounded-lg border bg-background/40 p-4", M.panelClass)}>
      <div className="mb-3 flex items-center justify-between">
        <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", M.badgeClass)}>
          <Icon className="h-3.5 w-3.5" />
          {M.label}
        </div>
        <span className="text-xs text-muted-foreground">
          Understanding: {understandingLabel(ev.understanding)}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-foreground/90">{ev.feedback}</p>

      {(ev.didWell || ev.missing) && (
        <div className="mt-3 space-y-1.5 border-t border-border/40 pt-3 text-xs">
          {ev.didWell && (
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-success">✓</span>
              <div>
                <span className="font-medium text-foreground/80">What you did well: </span>
                <span className="text-muted-foreground">{ev.didWell}</span>
              </div>
            </div>
          )}
          {ev.missing && ev.status !== "correct" && (
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-warning">→</span>
              <div>
                <span className="font-medium text-foreground/80">What you're missing: </span>
                <span className="text-muted-foreground">{ev.missing}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Diagnostic;
