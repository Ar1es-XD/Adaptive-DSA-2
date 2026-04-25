import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConceptBadge } from "@/components/Badges";
import { DIAGNOSTIC_QUESTIONS } from "@/data/diagnostic";
import { useTutorStore } from "@/lib/store";
import { CONCEPTS, type Concept } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const Diagnostic = () => {
  const navigate = useNavigate();
  const setDiagnostic = useTutorStore((s) => s.setDiagnostic);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<number | null>(null);

  const q = DIAGNOSTIC_QUESTIONS[idx];
  const isLast = idx === DIAGNOSTIC_QUESTIONS.length - 1;

  const choose = (i: number) => {
    if (revealed !== null) return;
    setRevealed(i);
  };

  const next = () => {
    const newPicks = [...picks, revealed!];
    setPicks(newPicks);
    setRevealed(null);
    if (isLast) {
      // Compute scores per concept (single Q per concept here, so binary 0/100)
      const scores = CONCEPTS.reduce((acc, c) => ({ ...acc, [c]: 0 }), {} as Record<Concept, number>);
      const counts = CONCEPTS.reduce((acc, c) => ({ ...acc, [c]: 0 }), {} as Record<Concept, number>);
      DIAGNOSTIC_QUESTIONS.forEach((qq, i) => {
        counts[qq.concept] += 1;
        if (newPicks[i] === qq.correctIndex) scores[qq.concept] += 100;
      });
      CONCEPTS.forEach((c) => { scores[c] = counts[c] ? Math.round(scores[c] / counts[c]) : 0; });
      setDiagnostic(scores);
      navigate("/profile");
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-2xl py-10">
        <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {idx + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
          <ConceptBadge concept={q.concept} />
        </div>
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-gradient-primary transition-all" style={{ width: `${((idx + (revealed !== null ? 1 : 0)) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }} />
        </div>
        <Card className="border-border/60 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-xl leading-snug">{q.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isPicked = revealed === i;
              const showState = revealed !== null;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={revealed !== null}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border bg-secondary/30 px-4 py-3 text-left text-sm transition-colors",
                    !showState && "hover:border-primary/50 hover:bg-secondary/60",
                    showState && isCorrect && "border-success/60 bg-success/10",
                    showState && isPicked && !isCorrect && "border-destructive/60 bg-destructive/10",
                  )}
                >
                  <span>{opt}</span>
                  {showState && isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                  {showState && isPicked && !isCorrect && <XCircle className="h-4 w-4 text-destructive" />}
                </button>
              );
            })}
            {revealed !== null && (
              <div className="mt-4 rounded-md border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                <strong className="text-foreground">Why:</strong> {q.explanation}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
          <Button onClick={next} disabled={revealed === null} className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            {isLast ? "See your profile" : "Next question"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Diagnostic;
