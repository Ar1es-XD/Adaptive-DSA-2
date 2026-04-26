import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTutorStore } from "@/lib/store";
import { Code2, ArrowRight, Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const setUser = useTutorStore(s => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.includes("@")) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setUser({ name: name.trim(), email: email.trim() });
    navigate("/waiver");
  };

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="font-mono text-xs text-white leading-loose opacity-30 whitespace-pre">
              {`function solve(n) {\n  if (n <= 1) return n;\n  return solve(n-1) + solve(n-2);\n}\n`}
            </div>
          ))}
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center border-2 border-primary-foreground/20">
            <Code2 className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-white font-pixel uppercase">Algora</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white tracking-tighter leading-tight mb-6">
            Master DSA.<br /><span className="text-primary">Your way.</span>
          </h2>
          <p className="text-xl text-white/60 font-medium leading-relaxed max-w-sm">
            Algora maps your learning curve and builds a personal roadmap — not a generic syllabus.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[["24","Problems"],["8","Patterns"],["100%","Adaptive"]].map(([n, l]) => (
              <div key={l} className="border-2 border-white/10 rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-primary font-pixel">{n}</div>
                <div className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-white/30 font-medium">© 2025 Algora. All rights reserved.</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter font-pixel uppercase">Algora</span>
          </div>

          <div className="mb-10">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Step 1 of 4</div>
            <h1 className="text-4xl font-black tracking-tighter uppercase font-pixel mb-3">Create Account</h1>
            <p className="text-muted-foreground font-medium">Begin your adaptive learning journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground/70 mb-2 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full h-14 px-5 rounded-2xl border-4 border-foreground bg-card text-foreground font-bold text-base focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground/70 mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ada@example.com"
                className="w-full h-14 px-5 rounded-2xl border-4 border-foreground bg-card text-foreground font-bold text-base focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-foreground/70 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-14 px-5 pr-14 rounded-2xl border-4 border-foreground bg-card text-foreground font-bold text-base focus:outline-none focus:border-primary transition-colors"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-4 border-red-400 rounded-2xl p-4 text-red-700 font-bold text-sm">{error}</div>
            )}

            <button
              type="submit"
              className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg border-4 border-foreground shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              Continue <ArrowRight className="h-6 w-6" />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-xs text-muted-foreground font-medium">Step 1 of 4</span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            {[0,1,2,3].map(i => (
              <div key={i} className={`h-2 rounded-full transition-all ${i === 0 ? "w-8 bg-primary" : "w-2 bg-foreground/20"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
