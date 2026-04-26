import { useNavigate, Link } from "react-router-dom";
import { useTutorStore } from "@/lib/store";
import { CONCEPTS, CONCEPT_LABELS } from "@/lib/types";
import { ArrowRight, BookOpen, Target, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const scoreLabel = (s: number) =>
  s >= 80 ? { label: "Strong", color: "text-green-600", bg: "bg-green-100", bar: "bg-green-500" } :
  s >= 50 ? { label: "Developing", color: "text-yellow-600", bg: "bg-yellow-100", bar: "bg-yellow-500" } :
             { label: "Focus Area", color: "text-primary", bg: "bg-primary/10", bar: "bg-primary" };

const DiagnosticResult = () => {
  const navigate = useNavigate();
  const { user, profile, diagnosticDone, plan } = useTutorStore();

  if (!user || !diagnosticDone) { navigate("/"); return null; }

  const sorted = [...CONCEPTS].sort((a, b) => profile.scores[a] - profile.scores[b]);
  const weakest = sorted.slice(0, 3);
  const strongest = sorted.slice(-2).reverse();
  const overall = Math.round(CONCEPTS.reduce((s, c) => s + profile.scores[c], 0) / CONCEPTS.length);

  return (
    <div className="min-h-screen bg-background font-sans py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Step indicator */}
        <div className="text-center mb-12">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Step 3 of 4 — Calibration Complete</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter font-pixel uppercase mb-6 leading-none">
            Your Profile,<br /><span className="text-primary">{user.name.split(" ")[0]}.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Here's what Algora learned from your diagnostic session.
          </p>
        </div>

        {/* Overall score */}
        <div className="bg-foreground text-background rounded-[3rem] p-10 mb-8 border-4 border-foreground shadow-[12px_12px_0_0_#bf2f1f] flex flex-col md:flex-row items-center gap-8">
          <div className="text-center shrink-0">
            <div className="text-8xl font-black font-pixel text-primary">{overall}</div>
            <div className="text-sm font-black uppercase tracking-widest text-background/60 mt-2">Overall Score</div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-3">
              {overall >= 70 ? "Strong foundation detected" : overall >= 40 ? "Solid starting point" : "Early-stage learner"}
            </h2>
            <p className="text-background/70 font-medium leading-relaxed">
              {overall >= 70
                ? "You have a solid grasp of fundamentals. Algora will push you toward more complex patterns and edge cases."
                : overall >= 40
                ? "You understand the basics. Algora will reinforce weak areas while building on what's already solid."
                : "You're just getting started — perfect. Algora will guide you from ground zero with no assumptions."}
            </p>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="bg-card border-4 border-foreground rounded-[2.5rem] p-8 mb-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center border-2 border-foreground">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Score Breakdown</h2>
          </div>
          <div className="space-y-5">
            {CONCEPTS.map(c => {
              const score = profile.scores[c];
              const meta = scoreLabel(score);
              return (
                <div key={c}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold uppercase tracking-wider text-sm">{CONCEPT_LABELS[c]}</span>
                    <span className={cn("text-xs font-black px-3 py-1 rounded-full", meta.bg, meta.color)}>{meta.label} · {score}%</span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden border-2 border-foreground/20">
                    <div className={cn("h-full rounded-full transition-all duration-700", meta.bar)} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border-4 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-black uppercase tracking-widest text-sm">Priority Focus Areas</h3>
            </div>
            <div className="space-y-3">
              {weakest.map((c, i) => (
                <Link key={c} to={`/concept/${c}`} className="flex items-center gap-3 hover:text-primary transition-colors group">
                  <span className="text-primary font-pixel font-black text-sm">0{i+1}</span>
                  <span className="font-bold">{CONCEPT_LABELS[c]}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{profile.scores[c]}%</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-card border-4 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-black uppercase tracking-widest text-sm">Your Strengths</h3>
            </div>
            <div className="space-y-3">
              {strongest.map((c, i) => (
                <div key={c} className="flex items-center gap-3">
                  <span className="text-green-600 font-pixel font-black text-sm">0{i+1}</span>
                  <span className="font-bold">{CONCEPT_LABELS[c]}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{profile.scores[c]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan preview */}
        {plan && (
          <div className="bg-card border-4 border-foreground rounded-2xl p-8 mb-8 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-black uppercase tracking-widest text-sm">Your Personalised Plan</h3>
            </div>
            <p className="text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap text-sm">{plan}</p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => navigate("/")}
          className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg border-4 border-foreground shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
        >
          Start My Journey <ArrowRight className="h-6 w-6" />
        </button>

        <div className="mt-8 flex gap-2 justify-center">
          {[0,1,2,3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === 2 ? "w-8 bg-primary" : i < 2 ? "w-2 bg-foreground/40" : "w-2 bg-foreground/20"}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticResult;
