import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeEditor } from "@/components/CodeEditor";
import { ConceptBadge, DifficultyBadge } from "@/components/Badges";
import { getProblem, PROBLEMS } from "@/data/problems";
import { CONCEPT_LABELS, type Language } from "@/lib/types";
import { useTutorStore } from "@/lib/store";
import { nextAfterSubmission } from "@/lib/adaptive";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Play, Send, Bug, Lightbulb, BookOpen, ArrowRight, CheckCircle2, XCircle, AlertCircle, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";

type Verdict = "Accepted" | "Wrong Answer" | "Needs Improvement";

interface EvalResult {
  verdict: Verdict;
  confidence: number;
  issues: string[];
  optimization: string;
  explanation: string;
  heuristics?: { hasLoop: boolean; hasRecursion: boolean; hasMap: boolean; hasReturn: boolean; lineCount: number };
}

const verdictMeta: Record<Verdict, { label: string; dot: string; text: string; border: string }> = {
  "Accepted":          { label: "Accepted",          dot: "status-dot-correct",   text: "text-success",     border: "border-success/60" },
  "Wrong Answer":      { label: "Wrong answer",      dot: "status-dot-incorrect", text: "text-destructive", border: "border-destructive/60" },
  "Needs Improvement": { label: "Needs improvement", dot: "status-dot-partial",   text: "text-warning",     border: "border-warning/60" },
};

const ProblemSolve = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problem = id ? getProblem(id) : undefined;

  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [testRunResults, setTestRunResults] = useState<{ idx: number; status: "passed" | "failed" | "pending" }[] | null>(null);

  // AI Assist state
  const [hintLevel, setHintLevel] = useState(0); // 0=none, 1-3 levels
  const [hintContent, setHintContent] = useState<string[]>([]);
  const [debugContent, setDebugContent] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);

  const profile = useTutorStore((s) => s.profile);
  const recordAttempt = useTutorStore((s) => s.recordAttempt);

  useEffect(() => {
    if (problem) setCode(problem.starterCode[language]);
    setResult(null);
    setTestRunResults(null);
    setHintLevel(0);
    setHintContent([]);
    setDebugContent(null);
  }, [problem, language]);

  const visibleTests = useMemo(() => problem?.testCases.filter((t) => !t.hidden) ?? [], [problem]);
  const hiddenCount = useMemo(() => problem?.testCases.filter((t) => t.hidden).length ?? 0, [problem]);

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container py-10"><p>Problem not found.</p></main>
      </div>
    );
  }

  const evaluate = async (): Promise<EvalResult | null> => {
    const expected = `Function should: ${problem.description}\nExample test cases:\n` +
      problem.testCases.filter(t => !t.hidden).map(t => `  input=${t.input} → expected=${t.expected}`).join("\n");
    const { data, error } = await supabase.functions.invoke("evaluate-code", {
      body: {
        problem: {
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          concept: problem.concept,
          fnName: problem.id,
        },
        code,
        language,
        expectedBehavior: expected,
      },
    });
    if (error) { toast.error(error.message); return null; }
    if (data?.error) { toast.error(data.error); return null; }
    return data as EvalResult;
  };

  const handleRun = async () => {
    setRunning(true);
    setTestRunResults(visibleTests.map((_, i) => ({ idx: i, status: "pending" })));
    const r = await evaluate();
    setRunning(false);
    if (!r) { setTestRunResults(null); return; }
    setResult(r);
    // Simulate test outcomes from verdict (no real execution)
    const allPass = r.verdict === "Accepted";
    const someFail = r.verdict === "Wrong Answer";
    setTestRunResults(visibleTests.map((_, i) => ({
      idx: i,
      status: allPass ? "passed" : someFail ? (i === 0 ? "failed" : "passed") : (i === visibleTests.length - 1 ? "failed" : "passed"),
    })));
  };

  const handleSubmit = async () => {
    setEvaluating(true);
    const r = await evaluate();
    setEvaluating(false);
    if (!r) return;
    setResult(r);
    const succeeded = r.verdict === "Accepted";
    recordAttempt(problem.concept, succeeded);
    setTestRunResults(problem.testCases.map((_, i) => ({
      idx: i,
      status: succeeded ? "passed" : (i === 0 ? "failed" : "passed"),
    })));
    if (succeeded) toast.success("Accepted! Profile updated.");
    else toast.warning(`${r.verdict} — see explanation`);
  };

  const goNext = () => {
    if (!result) return;
    const succeeded = result.verdict === "Accepted";
    const next = nextAfterSubmission(profile, problem, succeeded, [problem.id]);
    navigate(`/problems/${next.id}`);
  };

  const requestHint = async () => {
    if (hintLevel >= 3) return;
    setHintLoading(true);
    try {
      const nextLevel = hintLevel + 1;
      const { data, error } = await supabase.functions.invoke("ai-assist", {
        body: { mode: "hint", problem: { title: problem.title, description: problem.description }, hintLevel: nextLevel },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setHintContent((prev) => [...prev, data.content]);
      setHintLevel(nextLevel);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Hint failed");
    } finally {
      setHintLoading(false);
    }
  };

  const requestDebug = async () => {
    setDebugLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-assist", {
        body: {
          mode: "debug",
          problem: { title: problem.title, description: problem.description },
          code, language,
          result: result ? `${result.verdict} (${result.confidence}%): ${result.explanation}` : "no run yet",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setDebugContent(data.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Debug failed");
    } finally {
      setDebugLoading(false);
    }
  };

  const VerdictDisplay = () => {
    if (!result) return null;
    const v = verdictMeta[result.verdict];
    return (
      <div className={cn("slide-in space-y-3 border-l-2 pl-4 py-1", v.border)}>
        <div className="flex items-center gap-2.5">
          <span className={cn("status-dot", v.dot)} />
          <span className={cn("text-sm font-medium", v.text)}>{v.label}</span>
          <span className="text-xs text-muted-foreground">· {result.confidence}% confidence</span>
        </div>
        <p className="text-[15px] leading-relaxed text-foreground/85">{result.explanation}</p>
        {result.issues.length > 0 && (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {result.issues.map((iss, i) => (
              <li key={i}><span className="text-warning">→ </span>{iss}</li>
            ))}
          </ul>
        )}
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground/70">Approach · </span>{result.optimization}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-7xl py-8">
        {/* Why this problem — quiet inline strip */}
        <div className="mb-8 flex items-center gap-3 text-sm">
          <Target className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-foreground/80">
            Working on <span className="text-foreground">{CONCEPT_LABELS[problem.concept]}</span>
          </span>
          <span className="text-muted-foreground">— picked for where you have most room to grow</span>
          <Link
            to={`/concept/${problem.concept}`}
            className="ml-auto inline-flex shrink-0 items-center text-xs text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="mr-1 h-3.5 w-3.5" /> Concept
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT: problem — pure flow, no card */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ConceptBadge concept={problem.concept} />
                <DifficultyBadge difficulty={problem.difficulty} />
              </div>
              <h1 className="text-xl font-medium tracking-tight">{problem.title}</h1>
            </div>

            <p className="text-sm leading-relaxed text-foreground/80">{problem.description}</p>

            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Examples</div>
              <div className="space-y-2">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="border-l-2 border-border/50 pl-3 font-mono text-xs">
                    <div><span className="text-muted-foreground">in </span>{ex.input}</div>
                    <div><span className="text-muted-foreground">out </span>{ex.output}</div>
                    {ex.explanation && <div className="mt-1 font-sans text-muted-foreground">{ex.explanation}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Constraints</div>
              <ul className="space-y-0.5 font-mono text-xs text-muted-foreground">
                {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>

          {/* CENTER: editor — visual anchor */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Your solution
                </div>
                <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                  <SelectTrigger className="h-7 w-28 border-border/40 bg-transparent text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                height={420}
              />
              <div className="flex items-center gap-2 pt-1">
                <Button
                  onClick={handleRun}
                  disabled={running || evaluating}
                  variant="ghost"
                  size="sm"
                  className="text-foreground/80 hover:bg-secondary/60"
                >
                  {running ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
                  Run
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={running || evaluating}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {evaluating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1.5 h-3.5 w-3.5" />}
                  Submit
                </Button>
                {result && (
                  <Button onClick={goNext} variant="ghost" size="sm" className="ml-auto text-muted-foreground hover:text-foreground">
                    Next problem <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {testRunResults && (
              <div className="fade-in space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Test cases <span className="ml-1 text-muted-foreground/60">— simulated walkthrough</span>
                </div>
                <div className="space-y-1.5">
                  {visibleTests.map((tc, i) => {
                    const tr = testRunResults[i];
                    const dotClass =
                      tr?.status === "passed" ? "status-dot-correct"
                      : tr?.status === "failed" ? "status-dot-incorrect"
                      : "status-dot-idle";
                    return (
                      <div key={i} className="flex items-center gap-3 py-1 text-xs font-mono">
                        <span className={cn("status-dot", dotClass)} />
                        <span className="text-muted-foreground">in</span>
                        <span className="text-foreground/85">{tc.input}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-foreground/85">{tc.expected}</span>
                        {tr?.status === "pending" && <Loader2 className="ml-auto h-3 w-3 animate-spin text-muted-foreground" />}
                      </div>
                    );
                  })}
                  {hiddenCount > 0 && (
                    <div className="pt-1 text-xs text-muted-foreground">
                      + {hiddenCount} hidden test case{hiddenCount > 1 ? "s" : ""} on submit
                    </div>
                  )}
                </div>
              </div>
            )}

            <VerdictDisplay />
          </div>

          {/* RIGHT: Mentor — quiet tool, not a chatbot */}
          <div className="lg:col-span-3">
            <div className="space-y-4 lg:sticky lg:top-20">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Mentor</div>
                <span className="text-[11px] text-muted-foreground/70">Guidance, not answers</span>
              </div>

              <Tabs defaultValue="hint">
                <TabsList className="grid h-8 w-full grid-cols-2 bg-secondary/50 p-0.5">
                  <TabsTrigger value="hint" className="h-7 text-xs data-[state=active]:bg-background">
                    <Lightbulb className="mr-1 h-3 w-3" /> Hints
                  </TabsTrigger>
                  <TabsTrigger value="debug" className="h-7 text-xs data-[state=active]:bg-background">
                    <Bug className="mr-1 h-3 w-3" /> Review
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="hint" className="mt-4 space-y-3">
                  {hintContent.length === 0 && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Three nudges, in order: concept, then pattern, then structure. No spoilers.
                    </p>
                  )}
                  {hintContent.map((h, i) => (
                    <div key={i} className="fade-in space-y-1.5 border-l-2 border-border/40 pl-3">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        Hint {i + 1}
                      </div>
                      <div className="prose prose-sm prose-invert max-w-none text-foreground/85 [&_p]:text-sm [&_p]:my-1 [&_p]:leading-relaxed [&_ul]:my-1 [&_li]:text-sm">
                        <ReactMarkdown>{h}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={requestHint}
                    disabled={hintLoading || hintLevel >= 3}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                  >
                    {hintLoading ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Lightbulb className="mr-1.5 h-3 w-3" />}
                    {hintLevel >= 3
                      ? "No more hints"
                      : hintLevel === 0
                      ? "Give me a hint"
                      : `Next hint (${hintLevel + 1} of 3)`}
                  </Button>
                </TabsContent>

                <TabsContent value="debug" className="mt-4 space-y-3">
                  {!debugContent && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      I'll point out what's off in your current code — no rewrites.
                    </p>
                  )}
                  <Button
                    onClick={requestDebug}
                    disabled={debugLoading}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-muted-foreground hover:text-foreground"
                  >
                    {debugLoading ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Bug className="mr-1.5 h-3 w-3" />}
                    Review my code
                  </Button>
                  {debugContent && (
                    <div className="fade-in border-l-2 border-border/40 pl-3">
                      <div className="prose prose-sm prose-invert max-w-none text-foreground/85 [&_h3]:text-xs [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:font-medium [&_h3]:text-muted-foreground [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:my-1 [&_code]:text-xs [&_pre]:text-xs">
                        <ReactMarkdown>{debugContent}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSolve;
