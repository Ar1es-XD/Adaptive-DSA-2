import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CONCEPT_CONTENT } from "@/data/concepts";
import { CONCEPT_LABELS, type Concept as ConceptType } from "@/lib/types";
import { ArrowLeft, PlayCircle, Lightbulb, Target, BookOpen, Code, AlertTriangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── ARRAYS VISUALIZATION ────────────────────────────────────────────────────
const ArrayViz = () => {
  const nums = [3, 1, 7, 2, 9, 4, 6];
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const maxIdx = nums.indexOf(Math.max(...nums));
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setStep(s => {
          if (s >= nums.length - 1) { setRunning(false); return s; }
          return s + 1;
        });
      }, 700);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const restart = () => { setStep(0); setRunning(true); };
  const currentMax = Math.max(...nums.slice(0, step + 1));

  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-8 border-4 border-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-6">Live: Find Maximum Element</div>
      <div className="flex gap-3 mb-8 flex-wrap">
        {nums.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-14 h-14 flex items-center justify-center rounded-xl border-4 font-black text-xl transition-all duration-300",
              i === step ? "border-primary bg-primary text-white scale-110" :
              i < step && n === currentMax ? "border-green-400 bg-green-400/20 text-green-300" :
              i < step ? "border-gray-600 bg-gray-700 text-gray-300" :
              "border-gray-700 bg-gray-800 text-gray-400"
            )}>{n}</div>
            <span className="text-xs text-gray-500 font-mono">[{i}]</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm text-gray-300">
          <span className="text-gray-500">step:</span> <span className="text-primary font-bold">{step}</span>
          {"  "}<span className="text-gray-500">max so far:</span> <span className="text-green-400 font-bold">{currentMax}</span>
          {step === nums.length - 1 && <span className="text-yellow-400 font-bold ml-4">✓ Done! max = {currentMax}</span>}
        </div>
        <Button onClick={restart} size="sm" className="rounded-xl bg-primary border-2 border-foreground font-bold shadow-[3px_3px_0_0_#000]">
          {running ? "Running…" : "▶ Run"}
        </Button>
      </div>
    </div>
  );
};

// ─── TWO POINTERS VISUALIZATION ───────────────────────────────────────────────
const TwoPointerViz = () => {
  const nums = [1, 3, 5, 7, 9, 11, 13];
  const target = 14;
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(nums.length - 1);
  const [found, setFound] = useState(false);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const restart = () => { setLeft(0); setRight(nums.length - 1); setFound(false); setRunning(true); };

  useEffect(() => {
    if (running && !found) {
      intervalRef.current = setInterval(() => {
        setLeft(l => {
          setRight(r => {
            if (l >= r) { setRunning(false); return r; }
            const sum = nums[l] + nums[r];
            if (sum === target) { setFound(true); setRunning(false); return r; }
            if (sum < target) return r;
            return r - 1;
          });
          const sum2 = nums[l] + nums[right];
          if (sum2 < target && l < right - 1) return l + 1;
          return l;
        });
      }, 900);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, found]);

  const sum = nums[left] + nums[right];

  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-8 border-4 border-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">Live: Two Sum (target = {target})</div>
      <div className="text-xs text-gray-400 mb-6">Sorted array — pointers converge inward</div>
      <div className="flex gap-3 mb-6 flex-wrap">
        {nums.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-14 h-14 flex items-center justify-center rounded-xl border-4 font-black text-xl transition-all duration-300",
              found && (i === left || i === right) ? "border-green-400 bg-green-400/20 text-green-300 scale-110" :
              i === left ? "border-blue-400 bg-blue-400/20 text-blue-300 scale-110" :
              i === right ? "border-orange-400 bg-orange-400/20 text-orange-300 scale-110" :
              "border-gray-700 bg-gray-800 text-gray-400"
            )}>{n}</div>
            <span className={cn("text-xs font-bold",
              i === left && i === right ? "text-yellow-400" :
              i === left ? "text-blue-400" : i === right ? "text-orange-400" : "text-gray-600"
            )}>
              {i === left && i !== right ? "L" : i === right && i !== left ? "R" : i === left ? "L=R" : `[${i}]`}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm">
          <span className="text-blue-400">nums[L]={nums[left]}</span>
          <span className="text-gray-400"> + </span>
          <span className="text-orange-400">nums[R]={nums[right]}</span>
          <span className="text-gray-400"> = </span>
          <span className={found ? "text-green-400 font-bold" : sum < target ? "text-yellow-400" : "text-red-400"}>{sum}</span>
          {found && <span className="text-green-400 font-bold ml-3">✓ Found!</span>}
          {!found && sum < target && !running && left < right && <span className="text-yellow-400 ml-3">→ move L right</span>}
          {!found && sum > target && !running && left < right && <span className="text-red-400 ml-3">← move R left</span>}
        </div>
        <Button onClick={restart} size="sm" className="rounded-xl bg-primary border-2 border-foreground font-bold shadow-[3px_3px_0_0_#000]">
          {running ? "Running…" : "▶ Run"}
        </Button>
      </div>
    </div>
  );
};

// ─── SLIDING WINDOW VISUALIZATION ─────────────────────────────────────────────
const SlidingWindowViz = () => {
  const nums = [2, 4, 1, 7, 3, 5, 8, 2];
  const k = 3;
  const [windowStart, setWindowStart] = useState(0);
  const [maxSum, setMaxSum] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const getSum = (start: number) => nums.slice(start, start + k).reduce((a, b) => a + b, 0);

  const restart = () => { setWindowStart(0); setMaxSum(getSum(0)); setRunning(true); };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setWindowStart(s => {
          const next = s + 1;
          if (next + k > nums.length) { setRunning(false); return s; }
          const newSum = getSum(next);
          setMaxSum(m => Math.max(m, newSum));
          return next;
        });
      }, 800);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const currentSum = getSum(windowStart);

  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-8 border-4 border-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">Live: Max Sum Subarray (k={k})</div>
      <div className="text-xs text-gray-400 mb-6">Window slides right — add new element, drop old element</div>
      <div className="flex gap-3 mb-6 flex-wrap">
        {nums.map((n, i) => {
          const inWindow = i >= windowStart && i < windowStart + k;
          const isNew = i === windowStart + k - 1 && windowStart > 0;
          const isDropped = i === windowStart - 1;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-14 h-14 flex items-center justify-center rounded-xl border-4 font-black text-xl transition-all duration-300",
                inWindow ? "border-primary bg-primary/30 text-white scale-105" :
                isDropped ? "border-gray-600 bg-gray-800 text-gray-600" :
                "border-gray-700 bg-gray-800 text-gray-400"
              )}>{n}</div>
              <span className="text-xs text-gray-500 font-mono">[{i}]</span>
              {isNew && <span className="text-xs text-green-400 font-bold">+in</span>}
              {isDropped && <span className="text-xs text-red-400 font-bold">-out</span>}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm text-gray-300">
          <span className="text-gray-500">window[{windowStart}..{windowStart+k-1}]</span>
          {"  "}<span className="text-primary font-bold">sum={currentSum}</span>
          {"  "}<span className="text-green-400 font-bold">best={maxSum}</span>
        </div>
        <Button onClick={restart} size="sm" className="rounded-xl bg-primary border-2 border-foreground font-bold shadow-[3px_3px_0_0_#000]">
          {running ? "Sliding…" : "▶ Run"}
        </Button>
      </div>
    </div>
  );
};

// ─── RECURSION CALL STACK VISUALIZATION ───────────────────────────────────────
const RecursionViz = () => {
  const steps = [
    { stack: ["factorial(4)"], note: "Call factorial(4)" },
    { stack: ["factorial(4)", "factorial(3)"], note: "4 ≠ 0 → call factorial(3)" },
    { stack: ["factorial(4)", "factorial(3)", "factorial(2)"], note: "3 ≠ 0 → call factorial(2)" },
    { stack: ["factorial(4)", "factorial(3)", "factorial(2)", "factorial(1)"], note: "2 ≠ 0 → call factorial(1)" },
    { stack: ["factorial(4)", "factorial(3)", "factorial(2)", "factorial(1)", "factorial(0)"], note: "1 ≠ 0 → call factorial(0)" },
    { stack: ["factorial(4)", "factorial(3)", "factorial(2)", "factorial(1)", "return 1"], note: "BASE CASE: n=0 → return 1" },
    { stack: ["factorial(4)", "factorial(3)", "factorial(2)", "return 1×1=1"], note: "factorial(1) = 1×1 = 1 ✓" },
    { stack: ["factorial(4)", "factorial(3)", "return 2×1=2"], note: "factorial(2) = 2×1 = 2 ✓" },
    { stack: ["factorial(4)", "return 3×2=6"], note: "factorial(3) = 3×2 = 6 ✓" },
    { stack: ["return 4×6=24"], note: "factorial(4) = 4×6 = 24 ✓" },
  ];

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setStep(s => {
          if (s >= steps.length - 1) { setRunning(false); return s; }
          return s + 1;
        });
      }, 900);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const restart = () => { setStep(0); setRunning(true); };
  const current = steps[step];
  const isUnwinding = step >= 5;

  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-8 border-4 border-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">Call Stack: factorial(4)</div>
      <div className="text-xs text-gray-400 mb-6">Stack grows down (calls) then shrinks (returns)</div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-widest">
            {isUnwinding ? "⬆ Unwinding (returning)" : "⬇ Growing (calling)"}
          </div>
          <div className="flex flex-col gap-2">
            {current.stack.map((frame, i) => (
              <div key={i} className={cn(
                "px-4 py-2 rounded-xl border-2 font-mono text-sm transition-all",
                i === current.stack.length - 1
                  ? isUnwinding ? "border-green-400 bg-green-400/10 text-green-300" : "border-primary bg-primary/20 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-400",
              )}>
                {frame}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="bg-gray-800 rounded-2xl p-4 border-2 border-gray-700">
            <div className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-widest">Current Step</div>
            <p className="text-sm text-white font-medium">{current.note}</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 border-2 border-gray-700">
            <div className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-widest">Stack Depth</div>
            <div className="text-3xl font-black font-mono text-primary">{current.stack.length}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-gray-400">Step {step + 1} / {steps.length}</div>
        <div className="flex gap-3">
          <Button onClick={() => setStep(s => Math.max(0, s - 1))} size="sm" variant="outline" className="rounded-xl border-2 border-gray-600 text-gray-300">◀</Button>
          <Button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} size="sm" variant="outline" className="rounded-xl border-2 border-gray-600 text-gray-300">▶</Button>
          <Button onClick={restart} size="sm" className="rounded-xl bg-primary border-2 border-foreground font-bold shadow-[3px_3px_0_0_#000]">
            {running ? "Running…" : "▶ Auto"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── STACK VISUALIZATION ───────────────────────────────────────────────────
const StackViz = () => {
  const [items, setItems] = useState<string[]>(["A", "B"]);
  const [action, setAction] = useState<"push" | "pop" | "idle">("idle");
  
  const push = () => {
    if (items.length >= 6) return;
    setAction("push");
    setTimeout(() => {
      setItems(prev => [...prev, String.fromCharCode(65 + prev.length)]);
      setAction("idle");
    }, 400);
  };
  
  const pop = () => {
    if (items.length === 0) return;
    setAction("pop");
    setTimeout(() => {
      setItems(prev => prev.slice(0, -1));
      setAction("idle");
    }, 400);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-8 border-4 border-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-6">Live: LIFO (Last In First Out)</div>
      <div className="flex flex-col-reverse items-center justify-end h-[300px] border-b-8 border-gray-700 w-40 mx-auto bg-gray-900/50 rounded-b-2xl p-4 gap-2 mb-8">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={cn(
              "w-full h-12 flex items-center justify-center rounded-xl border-4 font-black text-xl transition-all duration-300",
              i === items.length - 1 && action === "pop" ? "bg-red-500 border-foreground scale-0 opacity-0" :
              i === items.length - 1 ? "bg-primary text-white border-foreground" :
              "bg-gray-800 text-gray-500 border-gray-700"
            )}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={push} disabled={action !== "idle" || items.length >= 6} className="bg-primary shadow-[4px_4px_0_0_#000] font-bold">Push</Button>
        <Button onClick={pop} disabled={action !== "idle" || items.length === 0} className="bg-red-600 shadow-[4px_4px_0_0_#000] font-bold">Pop</Button>
      </div>
    </div>
  );
};

// ─── HASH MAP VISUALIZATION ──────────────────────────────────────────────────
const HashMapViz = () => {
  const [keys, setKeys] = useState<{k: string, v: string, h: number}[]>([]);
  const [inputK, setInputK] = useState("name");
  const [inputV, setInputV] = useState("algora");
  const size = 8;
  
  const insert = () => {
    const h = inputK.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % size;
    setKeys(prev => [{k: inputK, v: inputV, h}, ...prev.slice(0, 5)]);
    setInputK(""); setInputV("");
  };

  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-8 border-4 border-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-6">Live: Key-Value Hashing</div>
      <div className="grid grid-cols-8 gap-2 mb-10">
        {Array.from({length: size}).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-full h-16 rounded-xl border-4 flex items-center justify-center font-bold text-xs overflow-hidden",
              keys[0]?.h === i ? "border-primary bg-primary/20 text-white" : "border-gray-800 bg-gray-900 text-gray-600"
            )}>
              {keys.filter(k => k.h === i).map(k => k.v.slice(0,3))}
            </div>
            <span className="text-[10px] font-mono text-gray-500">{i}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] uppercase font-black text-gray-500">Key</label>
          <input value={inputK} onChange={e => setInputK(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-2 text-white text-sm" />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] uppercase font-black text-gray-500">Value</label>
          <input value={inputV} onChange={e => setInputV(e.target.value)} className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-2 text-white text-sm" />
        </div>
        <Button onClick={insert} className="bg-primary h-10 font-bold shadow-[3px_3px_0_0_#000]">Hash & Set</Button>
      </div>
    </div>
  );
};

// ─── BINARY SEARCH VISUALIZATION ─────────────────────────────────────────────
const BinarySearchViz = () => {
  const nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const target = 23;
  const [l, setL] = useState(0);
  const [r, setR] = useState(nums.length - 1);
  const [step, setStep] = useState(0);
  const mid = Math.floor((l + r) / 2);
  
  const next = () => {
    if (nums[mid] === target) return;
    if (nums[mid] < target) setL(mid + 1);
    else setR(mid - 1);
    setStep(s => s + 1);
  };

  const reset = () => { setL(0); setR(nums.length - 1); setStep(0); };

  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-8 border-4 border-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-6">Live: Binary Search (Target: {target})</div>
      <div className="flex gap-2 mb-10 flex-wrap justify-center">
        {nums.map((n, i) => (
          <div key={i} className={cn(
            "w-12 h-12 flex items-center justify-center rounded-lg border-2 font-black transition-all duration-500",
            i === mid ? "border-yellow-400 bg-yellow-400 text-black scale-110 z-10" :
            i < l || i > r ? "border-gray-800 bg-gray-900 text-gray-700" :
            "border-gray-600 bg-gray-800 text-white"
          )}>{n}</div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-gray-500">
          L: {l} | R: {r} | Mid: {mid}
        </div>
        <div className="flex gap-2">
          <Button onClick={reset} size="sm" variant="outline" className="text-xs">Reset</Button>
          <Button onClick={next} disabled={nums[mid] === target} className="bg-primary font-bold shadow-[3px_3px_0_0_#000] text-xs">
            {nums[mid] === target ? "✓ Found" : "Calculate Mid"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── STRINGS VISUALIZATION ──────────────────────────────────────────────────
const StringsViz = () => {
  const text = "ALGO POWER";
  const pattern = "POW";
  const [offset, setOffset] = useState(0);
  const [found, setFound] = useState(false);
  
  const shift = () => {
    if (offset >= text.length - pattern.length) { setOffset(0); setFound(false); return; }
    const next = offset + 1;
    setOffset(next);
    if (text.slice(next, next + pattern.length) === pattern) setFound(true);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-3xl p-8 border-4 border-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-6">Live: Naive String Matching</div>
      <div className="font-mono text-3xl tracking-[0.5em] text-white mb-6 flex justify-center bg-black/40 p-6 rounded-2xl">
        {text.split("").map((c, i) => (
          <span key={i} className={cn(
            i >= offset && i < offset + pattern.length ? (found ? "text-green-400" : "text-primary underline decoration-4 underline-offset-8") : "opacity-30"
          )}>{c === " " ? "\u00A0" : c}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {found ? "Pattern Found!" : `Scanning: offset ${offset}`}
        </div>
        <Button onClick={shift} className="bg-primary font-bold shadow-[3px_3px_0_0_#000]">
          {found ? "Restart" : "Shift Pattern"}
        </Button>
      </div>
    </div>
  );
};

// ─── COMPLEXITY TABLE ─────────────────────────────────────────────────────────
const ComplexityTable = ({ data }: { data: Record<string, string> }) => (
  <div className="grid grid-cols-2 gap-4">
    {Object.entries(data).map(([key, val]) => (
      <div key={key} className="bg-card border-4 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{key.replace(/_/g, " ")}</div>
        <div className="text-2xl font-black font-mono text-primary">{val}</div>
      </div>
    ))}
  </div>
);


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const Concept = () => {
  const { concept } = useParams<{ concept: ConceptType }>();
  const data = concept ? CONCEPT_CONTENT[concept as keyof typeof CONCEPT_CONTENT] : undefined;

  if (!data) return (
    <div className="bg-background h-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl mb-4">Concept not found.</p>
        <Button asChild variant="outline"><Link to="/concepts">Back to Concepts</Link></Button>
      </div>
    </div>
  );

  const VizComponent = {
    arrays: ArrayViz,
    "two-pointers": TwoPointerViz,
    "sliding-window": SlidingWindowViz,
    recursion: RecursionViz,
    "hash-map": HashMapViz,
    stack: StackViz,
    "binary-search": BinarySearchViz,
    strings: StringsViz,
  }[concept as string] ?? null;

  return (
    <div className="min-h-full bg-background font-sans">
      <main className="container max-w-5xl py-12">
        <Link to="/concepts" className="inline-flex items-center text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12">
          <ArrowLeft className="mr-2 h-4 w-4" /> All Concepts
        </Link>

        {/* Hero */}
        <div className="mb-16">
          <div className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-4">Deep Dive</div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-pixel uppercase mb-6 leading-none">
            {data.title}
          </h1>
          <p className="text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
            {"tagline" in data ? data.tagline : ""}
          </p>
        </div>

        <div className="space-y-12">

          {/* Complexity */}
          {"complexity" in data && (
            <section>
              <SectionLabel icon={Zap} label="Complexity" />
              <ComplexityTable data={(data as any).complexity} />
            </section>
          )}

          {/* Interactive Visualization */}
          {VizComponent && (
            <section>
              <SectionLabel icon={PlayCircle} label="Interactive Visualization" />
              <VizComponent />
            </section>
          )}

          {/* Intuition */}
          <section>
            <SectionLabel icon={Lightbulb} label="Core Intuition" />
            <div className="bg-card border-4 border-foreground rounded-[2.5rem] p-10 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <p className="text-xl leading-relaxed font-medium">{data.intuition}</p>
            </div>
          </section>

          {/* When to use */}
          <section>
            <SectionLabel icon={Target} label="When to Use" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.whenToUse.map((w, i) => (
                <div key={i} className="bg-card border-4 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex gap-4">
                  <span className="text-primary font-black text-xl font-pixel shrink-0">0{i + 1}</span>
                  <p className="font-medium leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Walkthrough */}
          <section>
            <SectionLabel icon={BookOpen} label="Step-by-Step Walkthrough" />
            <div className="bg-foreground text-background rounded-[2.5rem] p-10 border-4 border-foreground shadow-[8px_8px_0_0_#bf2f1f]">
              <p className="text-xl leading-relaxed font-medium">{data.walkthrough}</p>
            </div>
          </section>

          {/* Code Skeleton */}
          <section>
            <SectionLabel icon={Code} label="Code Template" />
            <div className="rounded-[2.5rem] border-4 border-foreground overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
              <div className="bg-gray-900 px-6 py-3 flex items-center gap-2 border-b-4 border-foreground">
                <div className="w-3 h-3 rounded-full bg-red-400 border border-black" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />
                <div className="w-3 h-3 rounded-full bg-green-400 border border-black" />
                <span className="ml-4 text-gray-400 text-xs font-mono">{concept}.js</span>
              </div>
              <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-8 overflow-auto text-sm leading-relaxed font-mono">
                <code>{data.skeleton}</code>
              </pre>
            </div>
          </section>

          {/* Key Insights */}
          {"keyInsights" in data && (
            <section>
              <SectionLabel icon={Zap} label="Key Insights" />
              <div className="space-y-4">
                {(data as any).keyInsights.map((insight: string, i: number) => (
                  <div key={i} className="flex gap-5 items-start bg-primary/5 border-4 border-foreground rounded-2xl p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm shrink-0 border-2 border-foreground">{i + 1}</div>
                    <p className="font-medium text-lg leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Common Mistakes */}
          {"commonMistakes" in data && (
            <section>
              <SectionLabel icon={AlertTriangle} label="Common Mistakes" />
              <div className="space-y-4">
                {(data as any).commonMistakes.map((m: string, i: number) => (
                  <div key={i} className="flex gap-5 items-start bg-red-50 border-4 border-red-400 rounded-2xl p-6">
                    <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <p className="font-medium text-lg leading-relaxed text-red-800">{m}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="bg-foreground text-background rounded-[3rem] p-12 border-4 border-foreground shadow-[12px_12px_0_0_#bf2f1f] flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter font-pixel mb-3">Ready to practise?</h2>
              <p className="text-lg opacity-70 font-medium">Apply this pattern in the problem set — filtered to <strong className="opacity-100">{data.title}</strong> problems.</p>
            </div>
            <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-primary text-white border-4 border-primary font-bold text-lg shadow-[6px_6px_0_0_rgba(255,255,255,0.3)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <Link to={`/problems?concept=${concept}`}>
                <PlayCircle className="mr-3 h-6 w-6" /> Solve Problems
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

const SectionLabel = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white border-2 border-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
      <Icon className="h-5 w-5" />
    </div>
    <h2 className="text-2xl font-black uppercase tracking-tighter">{label}</h2>
  </div>
);

export default Concept;
