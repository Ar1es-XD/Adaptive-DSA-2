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

const verdictStyles: Record<Verdict, { color: string; bg: string; border: string; Icon: typeof CheckCircle2 }> = {
  "Accepted": { color: "text-success", bg: "bg-success/10", border: "border-success/40", Icon: CheckCircle2 },
  "Wrong Answer": { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/40", Icon: XCircle },
  "Needs Improvement": { color: "text-warning", bg: "bg-warning/10", border: "border-warning/40", Icon: AlertCircle },
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
    const v = verdictStyles[result.verdict];
    return (
      <Card className={cn("border-2", v.border, v.bg)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <v.Icon className={cn("h-5 w-5", v.color)} />
              <span className={cn("text-lg font-semibold", v.color)}>{result.verdict}</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">confidence {result.confidence}%</span>
          </div>
          <p className="mt-3 text-sm text-foreground/90">{result.explanation}</p>
          {result.issues.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Issues</div>
              <ul className="mt-1 space-y-1 text-sm">
                {result.issues.map((iss, i) => <li key={i} className="flex gap-2"><span className="text-destructive">•</span>{iss}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-3 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Optimization: </span>
            <span className="text-foreground/90">{result.optimization}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-7xl py-6">
        {/* Adaptivity banner */}
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-foreground/90">
            This problem is selected because you need to improve in <strong>{CONCEPT_LABELS[problem.concept]}</strong>.
            <Link to={`/concept/${problem.concept}`} className="ml-2 inline-flex items-center text-primary hover:underline">
              <BookOpen className="mr-1 h-3.5 w-3.5" /> Learn this concept
            </Link>
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* LEFT: problem */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="border-border/60 bg-gradient-card shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ConceptBadge concept={problem.concept} />
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>
                <CardTitle className="mt-2 text-xl">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-foreground/90 leading-relaxed">{problem.description}</p>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Examples</div>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="mt-2 rounded-md border border-border/60 bg-background/50 p-3 font-mono text-xs">
                      <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                      <div><span className="text-muted-foreground">Output:</span> {ex.output}</div>
                      {ex.explanation && <div className="mt-1 text-muted-foreground">{ex.explanation}</div>}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Constraints</div>
                  <ul className="space-y-0.5 font-mono text-xs text-muted-foreground">
                    {problem.constraints.map((c, i) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CENTER: editor */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/60 bg-gradient-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">Code</CardTitle>
                <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                  <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  height={360}
                />
                <div className="mt-3 flex items-center gap-2">
                  <Button onClick={handleRun} disabled={running || evaluating} variant="outline" size="sm">
                    {running ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1 h-3.5 w-3.5" />}
                    Run sample tests
                  </Button>
                  <Button onClick={handleSubmit} disabled={running || evaluating} size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                    {evaluating ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1 h-3.5 w-3.5" />}
                    Submit
                  </Button>
                  {result && (
                    <Button onClick={goNext} variant="ghost" size="sm" className="ml-auto">
                      Next adaptive problem <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {testRunResults && (
              <Card className="border-border/60 bg-gradient-card shadow-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Test cases (simulated — no execution)</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {visibleTests.map((tc, i) => {
                    const tr = testRunResults[i];
                    return (
                      <div key={i} className={cn(
                        "flex items-center justify-between rounded-md border p-2 text-xs font-mono",
                        tr?.status === "passed" && "border-success/40 bg-success/5",
                        tr?.status === "failed" && "border-destructive/40 bg-destructive/5",
                        tr?.status === "pending" && "border-border/60",
                      )}>
                        <div>
                          <span className="text-muted-foreground">in:</span> {tc.input} <span className="ml-2 text-muted-foreground">expect:</span> {tc.expected}
                        </div>
                        {tr?.status === "passed" && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {tr?.status === "failed" && <XCircle className="h-4 w-4 text-destructive" />}
                        {tr?.status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      </div>
                    );
                  })}
                  {hiddenCount > 0 && (
                    <div className="rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">
                      + {hiddenCount} hidden test case{hiddenCount > 1 ? "s" : ""} (revealed on Submit)
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <VerdictDisplay />
          </div>

          {/* RIGHT: AI Assist sidebar */}
          <div className="lg:col-span-3">
            <Card className="border-border/60 bg-gradient-card shadow-card lg:sticky lg:top-20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="hint">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="hint" className="text-xs"><Lightbulb className="mr-1 h-3.5 w-3.5" /> Hints</TabsTrigger>
                    <TabsTrigger value="debug" className="text-xs"><Bug className="mr-1 h-3.5 w-3.5" /> Debug</TabsTrigger>
                  </TabsList>

                  <TabsContent value="hint" className="space-y-3">
                    <p className="text-xs text-muted-foreground">3 escalating levels — concept → pattern → structure. Never reveals the solution.</p>
                    {hintContent.map((h, i) => (
                      <div key={i} className="rounded-md border border-border/60 bg-background/40 p-3 text-sm">
                        <div className="mb-1 text-xs font-semibold text-primary">Level {i + 1}</div>
                        <div className="prose prose-sm prose-invert max-w-none [&_p]:text-sm [&_p]:my-1 [&_ul]:my-1 [&_li]:text-sm">
                          <ReactMarkdown>{h}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                    <Button onClick={requestHint} disabled={hintLoading || hintLevel >= 3} variant="outline" size="sm" className="w-full">
                      {hintLoading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Lightbulb className="mr-1 h-3.5 w-3.5" />}
                      {hintLevel >= 3 ? "All levels revealed" : `Get hint level ${hintLevel + 1}`}
                    </Button>
                  </TabsContent>

                  <TabsContent value="debug" className="space-y-3">
                    <p className="text-xs text-muted-foreground">Analyzes your code + last verdict. Identifies issues without giving the full fix.</p>
                    <Button onClick={requestDebug} disabled={debugLoading} variant="outline" size="sm" className="w-full">
                      {debugLoading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Bug className="mr-1 h-3.5 w-3.5" />}
                      Debug my code
                    </Button>
                    {debugContent && (
                      <div className="rounded-md border border-border/60 bg-background/40 p-3">
                        <div className="prose prose-sm prose-invert max-w-none [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:text-sm [&_p]:my-1 [&_code]:text-xs [&_pre]:text-xs">
                          <ReactMarkdown>{debugContent}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSolve;
