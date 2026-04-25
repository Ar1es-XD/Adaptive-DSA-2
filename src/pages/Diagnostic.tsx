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
        <main className="container max-w-xl py-24">
          <div className="fade-in space-y-8">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Diagnostic
              </div>
              <h1 className="text-3xl font-medium tracking-tight">
                A short look at how you think.
              </h1>
              <p className="text-muted-foreground">
                Five questions, about two minutes. No trick questions — we're just calibrating
                what to show you next.
              </p>
            </div>

            <div className="space-y-3">
              {(["logical", "conceptual", "coding"] as const).map((k) => {
                const M = phaseMeta[k];
                const Icon = M.icon;
                return (
                  <div key={k} className="flex items-center gap-3 text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground/80">{M.label}</span>
                  </div>
                );
              })}
            </div>

            <Button
              size="lg"
              onClick={() => setStarted(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Begin
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
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
      <main className="container max-w-2xl py-12">
        {/* Phased progress — slim, calm */}
        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {idx + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
            <span className="inline-flex items-center gap-1.5">
              <PhaseIcon className="h-3 w-3" />
              {Phase.label}
            </span>
          </div>
          <div className="flex gap-1.5">
            {completedPerPhase.map((p) => {
              const pct = (p.completed / p.count) * 100;
              const isActive = q.kind === p.key;
              return (
                <div key={p.key} className="h-0.5 flex-1 overflow-hidden rounded-full bg-border/60">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 ease-out",
                      pct === 100 ? "bg-success" : isActive ? "bg-primary" : "bg-transparent",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Question — flows vertically, no card chrome */}
        <div className="fade-in space-y-8">
          <h2 className="text-xl font-normal leading-relaxed text-foreground/95 whitespace-pre-line">
            {q.prompt}
          </h2>

          {q.kind === "coding" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Your code · {q.language}</span>
                <span>{CODING_SUBLABEL[q.id] ?? "We're looking at your approach."}</span>
              </div>
              <CodeEditor
                value={answer}
                onChange={setAnswer}
                language={(q.language as Language) ?? "python"}
                height={280}
              />
              {CODING_HINTS[q.id] && (
                <p className="font-mono text-xs text-muted-foreground/70">
                  {CODING_HINTS[q.id]}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                  Your thinking
                </label>
                <Textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Walk through how you got there. The intuition matters most."
                  className="min-h-[120px] resize-y border-border/40 bg-card/30 text-base leading-relaxed focus-visible:ring-1 focus-visible:ring-primary/40"
                  disabled={evaluating || !!currentEval}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                  Short answer
                </label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="A one-liner conclusion."
                  className="min-h-[60px] resize-y border-border/40 bg-card/30 text-sm focus-visible:ring-1 focus-visible:ring-primary/40"
                  disabled={evaluating || !!currentEval}
                />
              </div>
            </div>
          )}

          {currentEval && <InlineFeedback ev={currentEval} />}

          <div className="flex justify-end pt-2">
            {!currentEval ? (
              <Button
                onClick={evaluate}
                disabled={!canEvaluate || evaluating}
                variant="ghost"
                className="text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Reviewing
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            ) : (
              <Button
                onClick={next}
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLast ? "See your profile" : "Next"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// ---------- evaluation panel ----------

// Inline feedback: dot + 1–2 line response, no card chrome
const statusMeta = {
  correct:   { label: "Correct",        dotClass: "status-dot-correct",   textClass: "text-success" },
  partial:   { label: "Almost there",   dotClass: "status-dot-partial",   textClass: "text-warning" },
  incorrect: { label: "Needs work",     dotClass: "status-dot-incorrect", textClass: "text-destructive" },
} as const;

const InlineFeedback = ({ ev }: { ev: DiagnosticEvaluation }) => {
  const M = statusMeta[ev.status];
  return (
    <div
      className={cn(
        "slide-in space-y-3 border-l-2 pl-4 py-1",
        ev.status === "correct" && "border-success/60",
        ev.status === "partial" && "border-warning/60",
        ev.status === "incorrect" && "border-destructive/60",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("status-dot", M.dotClass)} />
        <span className={cn("text-sm font-medium", M.textClass)}>{M.label}</span>
        <span className="text-xs text-muted-foreground">
          · {understandingLabel(ev.understanding)} understanding
        </span>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground/85">{ev.feedback}</p>

      {(ev.didWell || (ev.missing && ev.status !== "correct")) && (
        <div className="space-y-1.5 text-sm">
          {ev.didWell && (
            <p className="text-muted-foreground">
              <span className="text-success">+ </span>{ev.didWell}
            </p>
          )}
          {ev.missing && ev.status !== "correct" && (
            <p className="text-muted-foreground">
              <span className="text-warning">→ </span>{ev.missing}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Diagnostic;
