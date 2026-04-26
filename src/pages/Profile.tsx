import { Link, useNavigate } from "react-router-dom";
import { useTutorStore } from "@/lib/store";
import { CONCEPTS, CONCEPT_LABELS } from "@/lib/types";
import { PROBLEMS } from "@/data/problems";
import { cn } from "@/lib/utils";
import { ArrowRight, Flame, Star, Target, BookOpen, LogOut, Trophy, TrendingUp, Zap } from "lucide-react";

const scoreColor = (s: number) =>
  s >= 80 ? "bg-green-500" : s >= 50 ? "bg-yellow-500" : "bg-primary";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, diagnosticDone, points, streak, badges, signOut, reset } = useTutorStore();
  const solvedIds = profile.solvedIds ?? [];

  if (!user) { navigate("/"); return null; }

  const solvedByTopic = CONCEPTS.map(c => ({
    concept: c,
    solved: PROBLEMS.filter(p => p.concept === c && solvedIds.includes(p.id)).length,
    total: PROBLEMS.filter(p => p.concept === c).length,
    score: profile.scores[c],
  }));

  const totalSolved = solvedIds.length;
  const totalProblems = PROBLEMS.length;
  const overall = diagnosticDone
    ? Math.round(CONCEPTS.reduce((s, c) => s + profile.scores[c], 0) / CONCEPTS.length)
    : 0;

  const handleSignOut = () => { signOut(); navigate("/"); };
  const handleReset = () => { if (confirm("Reset all progress? This cannot be undone.")) { reset(); navigate("/"); } };

  return (
    <div className="bg-background min-h-full font-sans">
      <main className="container max-w-5xl py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-3">Your Profile</div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter font-pixel uppercase leading-none mb-3">
              {user.name}
            </h1>
            <p className="text-muted-foreground font-medium">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="h-10 px-4 rounded-xl border-2 border-foreground/30 text-xs font-black uppercase tracking-widest text-muted-foreground hover:border-red-400 hover:text-red-500 transition-all">
              Reset
            </button>
            <button onClick={handleSignOut} className="h-10 px-4 rounded-xl border-2 border-foreground bg-card font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-secondary transition-all">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            { icon: Star, label: "Points", value: points.toString(), color: "text-yellow-500" },
            { icon: Flame, label: "Day Streak", value: streak.toString(), color: "text-orange-500" },
            { icon: Trophy, label: "Solved", value: `${totalSolved}/${totalProblems}`, color: "text-green-500" },
            { icon: TrendingUp, label: "Avg Mastery", value: `${overall}%`, color: "text-primary" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card border-4 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <Icon className={cn("h-6 w-6 mb-3", color)} />
              <div className="text-3xl font-black font-pixel">{value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="bg-card border-4 border-foreground rounded-[2.5rem] p-8 mb-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center border-2 border-foreground">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Badges</h2>
          </div>
          {badges.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🔒</div>
              <p className="text-muted-foreground font-bold">Solve problems to unlock badges.</p>
              <Link to="/problems" className="mt-4 inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest hover:gap-3 transition-all">
                Go to Problems <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {badges.map(b => (
                <div key={b.id} className="flex items-center gap-3 bg-secondary border-2 border-foreground rounded-2xl px-5 py-3 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                  <span className="text-3xl">{b.icon}</span>
                  <div>
                    <div className="font-black text-sm uppercase tracking-wider">{b.label}</div>
                    <div className="text-xs text-muted-foreground font-medium">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Topic mastery */}
        <div className="bg-card border-4 border-foreground rounded-[2.5rem] p-8 mb-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center border-2 border-foreground">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Topic Mastery</h2>
          </div>
          {!diagnosticDone ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-bold mb-4">Complete your diagnostic to see mastery scores.</p>
              <Link to="/diagnostic" className="h-12 px-8 rounded-xl bg-primary text-white font-black text-sm border-2 border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all inline-flex items-center gap-2 uppercase tracking-widest">
                Take Diagnostic <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {solvedByTopic.sort((a, b) => a.score - b.score).map(({ concept, solved, total, score }) => (
                <Link key={concept} to={`/concept/${concept}`} className="block group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold uppercase tracking-wider text-sm group-hover:text-primary transition-colors">{CONCEPT_LABELS[concept]}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground font-medium">{solved}/{total} solved</span>
                      <span className="font-black text-foreground">{score}%</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden border-2 border-foreground/20">
                    <div className={cn("h-full rounded-full transition-all duration-700", scoreColor(score))} style={{ width: `${score}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Problem history */}
        <div className="bg-card border-4 border-foreground rounded-[2.5rem] p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center border-2 border-foreground">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Solved Problems</h2>
            <span className="ml-auto text-sm font-black text-primary">{totalSolved}/{totalProblems}</span>
          </div>
          {totalSolved === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-muted-foreground font-bold mb-4">No problems solved yet.</p>
              <Link to="/problems" className="h-12 px-8 rounded-xl bg-primary text-white font-black text-sm border-2 border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all inline-flex items-center gap-2 uppercase tracking-widest">
                Browse Problems <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PROBLEMS.filter(p => solvedIds.includes(p.id)).map(p => (
                <Link key={p.id} to={`/problems/${p.id}`} className="flex items-center gap-4 p-4 bg-secondary border-2 border-foreground/20 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="h-3 w-3 rounded-full bg-green-500 border-2 border-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold uppercase tracking-tight text-sm truncate group-hover:text-primary transition-colors">{p.title}</div>
                    <div className="text-xs text-muted-foreground font-medium">{CONCEPT_LABELS[p.concept]} · {p.difficulty}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
