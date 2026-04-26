import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTutorStore } from "@/lib/store";
import { ShieldCheck, ArrowRight, CheckSquare } from "lucide-react";

const POINTS = [
  { heading: "What we collect", body: "Your name, email, and in-app learning data (scores, answers, problem history). All stored locally in your browser — nothing leaves your device." },
  { heading: "How we use it", body: "Your scores and attempt history are used exclusively to personalise your study plan and surface the problems most likely to accelerate your growth." },
  { heading: "What we don't do", body: "We do not share your data with third parties, use it for advertising, or store it on any external server." },
  { heading: "Academic integrity", body: "Algora is a learning tool, not an exam. Using hints or the AI mentor during practice is encouraged. Do not submit externally generated solutions as your own in graded settings." },
  { heading: "Your control", body: "You may reset all your data at any time from the Profile page. This permanently deletes your learning history and progress." },
];

const Waiver = () => {
  const navigate = useNavigate();
  const user = useTutorStore(s => s.user);
  const [checked, setChecked] = useState(false);

  if (!user) { navigate("/"); return null; }

  return (
    <div className="min-h-screen bg-background font-sans flex items-start justify-center py-16 px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-20 w-20 bg-primary rounded-3xl flex items-center justify-center border-4 border-foreground shadow-[6px_6px_0_0_rgba(0,0,0,1)] mx-auto mb-8">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <div className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">Step 2 of 4</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase font-pixel mb-4 leading-tight">
            Your Agreement
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Hi <strong className="text-foreground">{user.name}</strong> — before we calibrate your path, here's exactly how Algora works.
          </p>
        </div>

        {/* Agreement points */}
        <div className="space-y-4 mb-10">
          {POINTS.map((p, i) => (
            <div key={i} className="bg-card border-4 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 bg-foreground text-background rounded-lg flex items-center justify-center font-pixel font-black text-sm shrink-0 mt-0.5">{i + 1}</div>
                <div>
                  <h3 className="font-black text-base uppercase tracking-wider mb-2">{p.heading}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkbox */}
        <button
          onClick={() => setChecked(c => !c)}
          className="w-full flex items-start gap-4 p-6 bg-card border-4 border-foreground rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-8 text-left hover:bg-secondary/50 transition-colors"
        >
          <div className={`h-7 w-7 rounded-lg border-4 border-foreground flex items-center justify-center shrink-0 transition-all ${checked ? "bg-primary" : "bg-background"}`}>
            {checked && <CheckSquare className="h-4 w-4 text-white" />}
          </div>
          <p className="font-bold text-base leading-relaxed">
            I understand and agree. I acknowledge that Algora stores my learning data locally to personalise my experience, and I accept the terms outlined above.
          </p>
        </button>

        {/* CTA */}
        <button
          disabled={!checked}
          onClick={() => navigate("/diagnostic")}
          className={`w-full h-16 rounded-2xl font-black text-lg border-4 border-foreground uppercase tracking-widest flex items-center justify-center gap-3 transition-all
            ${checked
              ? "bg-primary text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            }`}
        >
          Begin Calibration <ArrowRight className="h-6 w-6" />
        </button>

        {/* Progress dots */}
        <div className="mt-8 flex gap-2 justify-center">
          {[0,1,2,3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === 1 ? "w-8 bg-primary" : i === 0 ? "w-2 bg-foreground/40" : "w-2 bg-foreground/20"}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Waiver;
