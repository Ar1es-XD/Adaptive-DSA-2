import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/CodeEditor";
import { DIAGNOSTIC_QUESTIONS } from "@/data/diagnostic";
import { useTutorStore } from "@/lib/store";
import { CONCEPTS, CONCEPT_LABELS, type Concept, type DiagnosticEvaluation, type Language } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Brain,
  Code2,
  Loader2,
  AlertCircle,
  Sparkles,
  Timer,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const phaseMeta = {
  logical: { label: "Logical reasoning", icon: Brain },
  conceptual: { label: "Concept understanding", icon: Brain },
  coding: { label: "Coding", icon: Code2 },
} as const;

const understandingScore = (u: DiagnosticEvaluation["understanding"]) =>
  u === "high" ? 100 : u === "medium" ? 60 : 20;

const statusToScoreFactor = (s: DiagnosticEvaluation["status"]) =>
  s === "correct" ? 1 : s === "partial" ? 0.55 : 0.2;

const Diagnostic = () => {
  const navigate = useNavigate();
  const setDiagnostic = useTutorStore((s) => s.setDiagnostic);
  const incrementDiagnosticRound = useTutorStore((s) => s.incrementDiagnosticRound);
  const diagnosticDone = useTutorStore((s) => s.diagnosticDone);
  const diagnosticRounds = useTutorStore((s) => s.diagnosticRounds);
  const profile = useTutorStore((s) => s.profile);
  const isRetest = diagnosticDone; // already completed at least once

  const [started, setStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<Record<string, DiagnosticEvaluation>>({});
  const [currentEval, setCurrentEval] = useState<DiagnosticEvaluation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Anti-cheat state
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isCheating, setIsCheating] = useState(false);

  const q = DIAGNOSTIC_QUESTIONS[idx];
  const activeLanguage: Language = q?.kind === "coding" ? selectedLanguage : (q?.language ?? "python");
  const isLast = idx === DIAGNOSTIC_QUESTIONS.length - 1;
  const Phase = q ? phaseMeta[q.kind] : phaseMeta.logical;
  const PhaseIcon = Phase.icon;

  useEffect(() => {
    if (started) {
      setQuestionStartTime(Date.now());
      setIsCheating(false);
    }
  }, [idx, started]);

  const goToQuestion = (newIdx: number) => {
    const next = DIAGNOSTIC_QUESTIONS[newIdx];
    setIdx(newIdx);
    
    let defaultStarter = next.starter ?? "";
    if (next.kind === "coding" && selectedLanguage !== next.language) {
      const fnMatch = next.prompt.match(/`(\w+)\(/);
      const fnName = fnMatch ? fnMatch[1] : "solve";
      
      if (selectedLanguage === "javascript") {
        defaultStarter = `function ${fnName}(items) {\n  // your code here\n}`;
      } else if (selectedLanguage === "java") {
        defaultStarter = `public class Solution {\n    public void ${fnName}(Object items) {\n        // your code here\n    }\n}`;
      } else if (selectedLanguage === "cpp") {
        defaultStarter = `class Solution {\npublic:\n    void ${fnName}(auto items) {\n        // your code here\n    }\n};`;
      } else if (selectedLanguage === "python") {
        defaultStarter = `def ${fnName}(items):\n    # your code here\n    pass`;
      }
    }

    setAnswer(next.kind === "coding" ? defaultStarter : "");
    setReasoning("");
    setCurrentEval(null);
  };

  useEffect(() => {
    if (started && q.kind === "coding" && answer === "") setAnswer(q.starter ?? "");
  }, [started, q, answer]);

  const canEvaluate =
    answer.trim().length > 1 && (q.kind === "coding" || reasoning.trim().length > 1);

  const evaluate = async () => {
    if (!canEvaluate) return;
    
    // Cheat detection: submit in < 5 seconds
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    if (timeTaken < 5) {
      setIsCheating(true);
      toast.warning("Submission too fast! Take a moment to think deeper.", {
        icon: <ShieldAlert className="h-5 w-5 text-warning" />
      });
      return;
    }

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
          language: activeLanguage,
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
    if (isRetest) {
      incrementDiagnosticRound(scores);
    } else {
      setDiagnostic(scores);
    }
    navigate("/diagnostic-result");
  };

  const next = () => {
    if (isLast) finish();
    else goToQuestion(idx + 1);
  };

  if (!started) {
    const weakAreas = isRetest
      ? [...CONCEPTS].sort((a, b) => profile.scores[a] - profile.scores[b]).slice(0, 3)
      : [];

    return (
      <div className="bg-background min-h-full font-sans flex flex-col items-center justify-center p-6">
        <div className="container max-w-2xl bg-card border-4 border-foreground rounded-[3rem] p-12 shadow-[12px_12px_0_0_rgba(0,0,0,1)] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="h-20 w-20 bg-primary rounded-3xl flex items-center justify-center text-white border-2 border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)] mx-auto mb-10 rotate-3">
            <Sparkles className="h-10 w-10" />
          </div>

          {isRetest ? (
            <>
              <div className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-6">
                Recalibration · Round {diagnosticRounds + 1}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-pixel uppercase mb-6 leading-tight">
                Sharpen your <span className="text-primary">edge</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
                This session targets your current weak areas. Your new score will be <strong className="text-foreground">blended</strong> with your existing profile — each round has less weight, so growth is proportional, not volatile.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {weakAreas.map(c => (
                  <span key={c} className="px-4 py-2 bg-primary/10 border-2 border-primary/30 text-primary font-bold text-sm rounded-xl">
                    {CONCEPT_LABELS[c]} · {profile.scores[c]}%
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-6">Heuristic Calibration</div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-pixel uppercase mb-8 leading-tight">
                How do you <span className="text-primary">solve</span>?
              </h1>
              <p className="text-xl text-muted-foreground font-medium mb-12 leading-relaxed">
                10 questions mapping your logic, conceptual grasp, and implementation speed. Algora curates a path tailored to your learning curve.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-12 text-left">
                <div className="p-4 bg-secondary rounded-2xl border-2 border-foreground/10 flex items-center gap-3">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="font-bold uppercase tracking-widest text-xs">5 Logic Puzzles</span>
                </div>
                <div className="p-4 bg-secondary rounded-2xl border-2 border-foreground/10 flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-primary" />
                  <span className="font-bold uppercase tracking-widest text-xs">5 Coding Tasks</span>
                </div>
              </div>
            </>
          )}

          {/* Language Picker */}
          <div className="mb-10 text-left">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/70 mb-4 block text-center">Select Preferred Language</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
              {(["python", "javascript", "cpp", "java"] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={cn(
                    "px-4 py-3 rounded-xl border-4 font-bold uppercase text-xs tracking-wider transition-all",
                    selectedLanguage === lang 
                      ? "bg-primary text-white border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)]" 
                      : "bg-card border-foreground/10 hover:border-foreground/30"
                  )}
                >
                  {lang === "cpp" ? "C++" : lang}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setStarted(true)}
            className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-2 border-foreground"
          >
            {isRetest ? `Start Recalibration` : "Start Diagnostic"} <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background font-sans py-12">
      <main className="container max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-foreground text-background font-pixel px-3 py-1 rounded-lg text-xs">
                {idx + 1}/{DIAGNOSTIC_QUESTIONS.length}
              </div>
              <div className="text-sm font-black uppercase tracking-[0.2em]">{Phase.label}</div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Live Session</span>
            </div>
          </div>
          <div className="h-6 w-full bg-muted border-4 border-foreground rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-primary transition-all duration-700 ease-out border-r-4 border-foreground" 
              style={{ width: `${((idx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }} 
            />
          </div>
        </div>

        {/* Question Area */}
        <div className="space-y-12">
          <div className="bg-card border-4 border-foreground rounded-[3rem] p-12 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-foreground whitespace-pre-line mb-10">
              {q.prompt}
            </h2>

            {q.kind === "coding" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                  <span>Implementation Area ({activeLanguage})</span>
                </div>
                <div className="rounded-[1.5rem] border-4 border-foreground overflow-hidden shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]">
                  <CodeEditor
                    value={answer}
                    onChange={setAnswer}
                    language={activeLanguage}
                    height={350}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 block">Explain your thinking</label>
                  <Textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    placeholder="Walk us through your logic. Intuition is more valuable than the final answer."
                    className="min-h-[160px] text-lg rounded-2xl border-4 border-foreground bg-secondary/30 p-6 focus-visible:ring-0 shadow-inner"
                    disabled={evaluating || !!currentEval}
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 block">Final Conclusion</label>
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Briefly summarize your answer."
                    className="min-h-[80px] text-lg rounded-2xl border-4 border-foreground bg-secondary/30 p-6 focus-visible:ring-0 shadow-inner"
                    disabled={evaluating || !!currentEval}
                  />
                </div>
              </div>
            )}

            {isCheating && (
              <div className="mt-8 p-6 bg-warning/10 border-4 border-warning rounded-2xl flex items-center gap-4 text-warning animate-shake">
                <AlertCircle className="h-8 w-8 shrink-0" />
                <div>
                  <div className="font-black uppercase tracking-widest text-sm">Caution: Rapid Submission</div>
                  <p className="font-bold opacity-80">Algora values depth over speed. Please take at least 5 seconds to process the problem.</p>
                </div>
              </div>
            )}

            {currentEval && (
              <div className={cn(
                "mt-12 p-10 rounded-[2.5rem] border-4 border-foreground shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]",
                currentEval.status === "correct" ? "bg-green-50/50" : "bg-orange-50/50"
              )}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    "h-4 w-4 rounded-full border-2 border-foreground animate-pulse",
                    currentEval.status === "correct" ? "bg-green-500" : "bg-orange-500"
                  )} />
                  <span className="font-black uppercase tracking-[0.2em] text-sm">Analysis Complete</span>
                </div>
                <p className="text-xl font-bold leading-relaxed mb-6">{currentEval.feedback}</p>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-foreground text-background rounded-xl font-pixel text-[10px] uppercase">
                    {currentEval.understanding} GRASP
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-12">
              {!currentEval ? (
                <Button
                  size="lg"
                  onClick={evaluate}
                  disabled={!canEvaluate || evaluating}
                  className="h-16 px-12 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-all border-4 border-foreground shadow-[6px_6px_0_0_rgba(0,0,0,0.3)]"
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Analyzing Logic
                    </>
                  ) : (
                    <>
                      Process Submission <ArrowRight className="ml-3 h-6 w-6" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={next}
                  disabled={submitting}
                  className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground font-bold text-xl hover:bg-primary/90 transition-all border-4 border-foreground shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
                >
                  {isLast ? "See Final Results" : "Next Challenge"}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Diagnostic;
