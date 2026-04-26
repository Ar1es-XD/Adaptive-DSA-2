import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CONCEPT_CONTENT } from "@/data/concepts";
import { CONCEPT_LABELS, type Concept as ConceptType } from "@/lib/types";
import { ArrowLeft, PlayCircle, Lightbulb, Target, BookOpen, Code, AlertTriangle, Zap, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const CodePanel = ({ code, activeLine }: { code: string[]; activeLine: number }) => (
  <div className="bg-[#0d0d0d] rounded-2xl p-6 font-mono text-xs md:text-sm border-2 border-gray-800 shadow-inner overflow-hidden">
    <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 font-black uppercase tracking-widest">
      <Terminal className="h-3 w-3" /> Execution Trace
    </div>
    <div className="space-y-1">
      {code.map((line, i) => (
        <div 
          key={i} 
          className={cn(
            "px-2 py-0.5 rounded transition-all duration-200 flex items-start",
            i === activeLine ? "bg-primary/20 text-primary border-l-4 border-primary -ml-2 pl-3 scale-[1.02]" : "text-gray-500 opacity-60"
          )}
        >
          <span className="inline-block w-4 mr-4 text-right text-gray-700 shrink-0">{i + 1}</span>
          <span className="whitespace-pre">{line}</span>
        </div>
      ))}
    </div>
  </div>
);

const VisualizerLayout = ({ children, code, activeLine, title, subtitle }: { children: React.ReactNode; code: string[]; activeLine: number; title: string; subtitle?: string }) => (
  <div className="bg-[#1e1e1e] rounded-[3rem] p-8 border-4 border-foreground shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
    <div className="mb-8">
      <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-8">
        {children}
      </div>
      <CodePanel code={code} activeLine={activeLine} />
    </div>
  </div>
);

export interface VisualizerHandle {
  run: () => void;
}

// ─── ARRAYS VISUALIZATION ────────────────────────────────────────────────────
const ArrayViz = forwardRef<VisualizerHandle>((_, ref) => {
  const nums = [3, 1, 7, 2, 9, 4, 6];
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const code = [
    "def find_max(nums):",
    "  res = nums[0]",
    "  for i in range(1, len(nums)):",
    "    if nums[i] > res:",
    "      res = nums[i]",
    "  return res"
  ];

  const getLine = () => {
    if (step === 0) return 1;
    if (step === nums.length - 1) return 5;
    return 3;
  };

  useImperativeHandle(ref, () => ({ run: restart }));

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
    <VisualizerLayout 
      title="Live: Find Maximum Element" 
      code={code} 
      activeLine={getLine()}
    >
      <div className="flex gap-3 mb-8 flex-wrap">
        {nums.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-12 h-12 flex items-center justify-center rounded-xl border-4 font-black text-xl transition-all duration-300",
              i === step ? "border-primary bg-primary text-white scale-110" :
              i < step && n === currentMax ? "border-green-400 bg-green-400/20 text-green-300" :
              i < step ? "border-gray-600 bg-gray-700 text-gray-300" :
              "border-gray-700 bg-gray-800 text-gray-400"
            )}>{n}</div>
            <span className="text-[10px] text-gray-500 font-mono">[{i}]</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-black/30 p-4 rounded-2xl border-2 border-gray-800 shadow-inner">
        <div className="font-mono text-xs text-gray-300">
          <span className="text-gray-500">i:</span> <span className="text-primary font-bold">{step}</span>
          {"  "}<span className="text-gray-500">res:</span> <span className="text-green-400 font-bold">{currentMax}</span>
        </div>
        <Button onClick={restart} size="sm" className="rounded-xl bg-primary border-2 border-foreground font-bold shadow-[3px_3px_0_0_#000] text-xs">
          {running ? "Running…" : "▶ Restart"}
        </Button>
      </div>
      {step === nums.length - 1 && (
        <div className="mt-4 p-4 bg-green-400/10 border-2 border-green-400 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Final Maximum</span>
          <span className="text-xl font-black text-green-300 font-mono">{currentMax}</span>
        </div>
      )}
    </VisualizerLayout>
  );
});

// ─── TWO POINTERS VISUALIZATION ───────────────────────────────────────────────
const TwoPointerViz = forwardRef<VisualizerHandle>((_, ref) => {
  const nums = [1, 3, 5, 7, 9, 11, 13];
  const target = 18;
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(nums.length - 1);
  const [found, setFound] = useState(false);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const code = [
    "def two_sum(nums, target):",
    "  L, R = 0, len(nums) - 1",
    "  while L < R:",
    "    sum = nums[L] + nums[R]",
    "    if sum == target: return True",
    "    if sum < target: L += 1",
    "    else: R -= 1",
    "  return False"
  ];

  const getLine = () => {
    if (found) return 4;
    if (!running) return 2;
    const sum = nums[left] + nums[right];
    if (sum < target) return 5;
    return 6;
  };

  useImperativeHandle(ref, () => ({ run: restart }));

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
    <VisualizerLayout 
      title={`Live: Two Sum (target = ${target})`} 
      subtitle="Sorted array — pointers converge inward"
      code={code}
      activeLine={getLine()}
    >
      <div className="flex gap-2 mb-6 flex-wrap">
        {nums.map((n, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-11 h-11 flex items-center justify-center rounded-xl border-4 font-black text-lg transition-all duration-300",
              found && (i === left || i === right) ? "border-green-400 bg-green-400/20 text-green-300 scale-110" :
              i === left ? "border-blue-400 bg-blue-400/20 text-blue-300 scale-110" :
              i === right ? "border-orange-400 bg-orange-400/20 text-orange-300 scale-110" :
              "border-gray-700 bg-gray-800 text-gray-400"
            )}>{n}</div>
            <span className={cn("text-[10px] font-bold",
              i === left && i === right ? "text-yellow-400" :
              i === left ? "text-blue-400" : i === right ? "text-orange-400" : "text-gray-600"
            )}>
              {i === left && i !== right ? "L" : i === right && i !== left ? "R" : i === left ? "L=R" : `[${i}]`}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-black/30 p-4 rounded-2xl border-2 border-gray-800 shadow-inner">
        <div className="font-mono text-[10px] text-gray-300">
          <span className="text-blue-400">{nums[left]}</span> + <span className="text-orange-400">{nums[right]}</span> = <span className={found ? "text-green-400 font-bold" : "text-white"}>{sum}</span>
          {found && <span className="text-green-400 font-bold ml-2">✓</span>}
        </div>
        <Button onClick={restart} size="sm" className="rounded-xl bg-primary border-2 border-foreground font-bold shadow-[3px_3px_0_0_#000] text-xs">
          {running ? "Running…" : "▶ Restart"}
        </Button>
      </div>
      {found && (
        <div className="mt-4 p-4 bg-green-400/10 border-2 border-green-400 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Result Found</span>
          <span className="text-sm font-black text-green-300 font-mono">Index {left} and {right} sum to {target}</span>
        </div>
      )}
    </VisualizerLayout>
  );
});

// ─── SLIDING WINDOW VISUALIZATION ─────────────────────────────────────────────
const SlidingWindowViz = forwardRef<VisualizerHandle>((_, ref) => {
  const nums = [2, 4, 1, 7, 3, 5, 8, 2];
  const k = 3;
  const [windowStart, setWindowStart] = useState(0);
  const [maxSum, setMaxSum] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const code = [
    "def max_subarray(nums, k):",
    "  curr_sum = sum(nums[:k])",
    "  max_sum = curr_sum",
    "  for i in range(len(nums) - k):",
    "    curr_sum += nums[i+k] - nums[i]",
    "    max_sum = max(max_sum, curr_sum)",
    "  return max_sum"
  ];

  const getLine = () => {
    if (!running) return 1;
    if (windowStart === 0) return 2;
    return 4;
  };

  useImperativeHandle(ref, () => ({ run: restart }));

  const getSum = (start: number) => nums.slice(start, start + k).reduce((a, b) => a + b, 0);

  const restart = () => { setWindowStart(0); setMaxSum(getSum(0)); setRunning(true); };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setWindowStart(s => {
          if (s >= nums.length - k) { setRunning(false); return s; }
          const next = s + 1;
          const current = getSum(next);
          setMaxSum(m => Math.max(m, current));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const currentSum = getSum(windowStart);

  return (
    <VisualizerLayout
      title={`Live: Fixed Sliding Window (k=${k})`}
      subtitle="O(N) time — reuse current sum for next window"
      code={code}
      activeLine={getLine()}
    >
      <div className="flex gap-2 mb-6 flex-wrap">
        {nums.map((n, i) => {
          const inWindow = i >= windowStart && i < windowStart + k;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl border-4 font-black text-lg transition-all duration-300",
                inWindow ? "border-primary bg-primary/20 text-white scale-110 z-10" : "border-gray-800 bg-gray-900 text-gray-700"
              )}>{n}</div>
              <span className="text-[10px] text-gray-500 font-mono">[{i}]</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between bg-black/30 p-4 rounded-2xl border-2 border-gray-800 shadow-inner">
        <div className="font-mono text-[10px] text-gray-300">
          <span className="text-primary">window sum:</span> <span className="font-bold text-white">{currentSum}</span>
          {"  "}<span className="text-green-400">max so far:</span> <span className="font-bold text-green-400">{maxSum}</span>
        </div>
        <Button onClick={restart} size="sm" className="rounded-xl bg-primary border-2 border-foreground font-bold shadow-[3px_3px_0_0_#000] text-xs">
          {running ? "Running…" : "▶ Restart"}
        </Button>
      </div>
      {windowStart === nums.length - k && !running && (
        <div className="mt-4 p-4 bg-green-400/10 border-2 border-green-400 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Max Subarray Sum</span>
          <span className="text-xl font-black text-green-300 font-mono">{maxSum}</span>
        </div>
      )}
    </VisualizerLayout>
  );
});

// ─── RECURSION VISUALIZATION ──────────────────────────────────────────────────
const RecursionViz = forwardRef<VisualizerHandle>((_, ref) => {
  const steps = [
    { stack: ["fact(4)"], note: "Call factorial(4)", val: null },
    { stack: ["fact(4)", "fact(3)"], note: "fact(4) = 4 * fact(3)", val: null },
    { stack: ["fact(4)", "fact(3)", "fact(2)"], note: "fact(3) = 3 * fact(2)", val: null },
    { stack: ["fact(4)", "fact(3)", "fact(2)", "fact(1)"], note: "fact(2) = 2 * fact(1)", val: null },
    { stack: ["fact(4)", "fact(3)", "fact(2)", "fact(1)", "fact(0)"], note: "Base case! return 1", val: 1 },
    { stack: ["fact(4)", "fact(3)", "fact(2)", "fact(1)"], note: "fact(1) = 1 * 1 = 1", val: 1 },
    { stack: ["fact(4)", "fact(3)", "fact(2)"], note: "fact(2) = 2 * 1 = 2", val: 2 },
    { stack: ["fact(4)", "fact(3)"], note: "fact(3) = 3 * 2 = 6", val: 6 },
    { stack: ["fact(4)"], note: "fact(4) = 4 * 6 = 24", val: 24 },
  ];
  
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const code = [
    "def fact(n):",
    "  if n <= 1: return 1",
    "  return n * fact(n - 1)"
  ];

  const getLine = () => {
    if (step === 4) return 1;
    if (step < 4) return 2;
    return 2;
  };

  useImperativeHandle(ref, () => ({ run: restart }));

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setStep(s => {
          if (s >= steps.length - 1) { setRunning(false); return s; }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const restart = () => { setStep(0); setRunning(true); };
  const current = steps[step];
  const isUnwinding = step >= 4;

  return (
    <VisualizerLayout
      title="Call Stack: factorial(4)"
      subtitle="Stack grows down (calls) then shrinks (returns)"
      code={code}
      activeLine={getLine()}
    >
      <div className="bg-black/30 p-6 rounded-2xl border-2 border-gray-800 shadow-inner">
        <div className="text-[10px] text-gray-500 mb-3 font-bold uppercase tracking-widest">
          {isUnwinding ? "⬆ Unwinding (returning)" : "⬇ Growing (calling)"}
        </div>
        <div className="flex flex-col gap-2 min-h-[160px]">
          {current.stack.map((frame, i) => (
            <div key={i} className={cn(
              "px-4 py-2 rounded-xl border-2 font-mono text-xs transition-all",
              i === current.stack.length - 1
                ? isUnwinding ? "border-green-400 bg-green-400/10 text-green-300" : "border-primary bg-primary/20 text-white"
                : "border-gray-700 bg-gray-800 text-gray-400",
            )}>
              {frame}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setStep(s => Math.max(0, s - 1))} size="sm" variant="outline" className="rounded-xl border-2 border-gray-600 text-gray-300 text-xs h-8">◀</Button>
          <Button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} size="sm" variant="outline" className="rounded-xl border-2 border-gray-600 text-gray-300 text-xs h-8">▶</Button>
        </div>
        <Button onClick={restart} size="sm" className="rounded-xl bg-primary border-2 border-foreground font-bold shadow-[3px_3px_0_0_#000] text-xs">
          {running ? "Running…" : "▶ Restart"}
        </Button>
      </div>
      {current.val !== null && (
        <div className="mt-6 p-4 bg-green-400/10 border-2 border-green-400 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-green-400 tracking-widest mb-1">Function Result</span>
            <span className="text-xs text-green-500/70 font-medium">factorial(4) calculated</span>
          </div>
          <span className="text-2xl font-black text-green-300 font-mono">{current.val}</span>
        </div>
      )}
    </VisualizerLayout>
  );
});

// ─── STACK VISUALIZATION ───────────────────────────────────────────────────
const StackViz = forwardRef<VisualizerHandle>((_, ref) => {
  const [items, setItems] = useState<string[]>(["A", "B"]);
  const [action, setAction] = useState<"push" | "pop" | "idle">("idle");
  const [activeLine, setActiveLine] = useState(0);
  const [running, setRunning] = useState(false);
  
  const code = [
    "stack = []",
    "stack.append('A')",
    "stack.append('B')",
    "stack.pop() # LIFO"
  ];

  useImperativeHandle(ref, () => ({ run: () => { setRunning(true); } }));

  useEffect(() => {
    if (running) {
      // Auto sequence: Push C, then Pop C
      const timer1 = setTimeout(() => push(), 500);
      const timer2 = setTimeout(() => pop(), 1500);
      const timer3 = setTimeout(() => setRunning(false), 2500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }
  }, [running]);

  const push = () => {
    if (items.length >= 6) return;
    setAction("push");
    setActiveLine(1);
    setTimeout(() => {
      setItems(prev => [...prev, String.fromCharCode(65 + prev.length)]);
      setAction("idle");
    }, 400);
  };
  
  const pop = () => {
    if (items.length === 0) return;
    setAction("pop");
    setActiveLine(3);
    setTimeout(() => {
      setItems(prev => prev.slice(0, -1));
      setAction("idle");
    }, 400);
  };

  return (
    <VisualizerLayout
      title="Live: LIFO (Last In First Out)"
      code={code}
      activeLine={activeLine}
    >
      <div className="flex flex-col-reverse items-center justify-end h-[240px] border-b-8 border-gray-700 w-32 mx-auto bg-gray-900/50 rounded-b-2xl p-4 gap-2">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={cn(
              "w-full h-10 flex items-center justify-center rounded-lg border-4 font-black text-lg transition-all duration-300",
              i === items.length - 1 && action === "pop" ? "bg-red-500 border-foreground scale-0 opacity-0" :
              i === items.length - 1 ? "bg-primary text-white border-foreground" :
              "bg-gray-800 text-gray-500 border-gray-700"
            )}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={push} disabled={action !== "idle" || items.length >= 6} className="bg-primary shadow-[4px_4px_0_0_#000] font-bold text-xs">Push</Button>
        <Button onClick={pop} disabled={action !== "idle" || items.length === 0} className="bg-red-600 shadow-[4px_4px_0_0_#000] font-bold text-xs">Pop</Button>
      </div>
    </VisualizerLayout>
  );
});

// ─── HASH MAP VISUALIZATION ──────────────────────────────────────────────────
const HashMapViz = forwardRef<VisualizerHandle>((_, ref) => {
  const [keys, setKeys] = useState<{k: string, v: string, h: number}[]>([]);
  const [inputK, setInputK] = useState("name");
  const [inputV, setInputV] = useState("algora");
  const [activeLine, setActiveLine] = useState(0);
  const [running, setRunning] = useState(false);
  const size = 8;

  const code = [
    "hash_map = {}",
    "index = hash(key) % size",
    "hash_map[index] = value"
  ];
  
  useImperativeHandle(ref, () => ({ run: () => { setRunning(true); insert(); setTimeout(() => setRunning(false), 1000); } }));

  const insert = () => {
    setActiveLine(1);
    const h = inputK.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % size;
    setTimeout(() => {
      setActiveLine(2);
      setKeys(prev => [{k: inputK, v: inputV, h}, ...prev.slice(0, 5)]);
      setInputK(""); setInputV("");
    }, 500);
  };

  return (
    <VisualizerLayout
      title="Live: Key-Value Hashing"
      code={code}
      activeLine={activeLine}
    >
      <div className="grid grid-cols-4 gap-2 mb-6">
        {Array.from({length: size}).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={cn(
              "w-full h-12 rounded-lg border-2 flex items-center justify-center font-bold text-[10px] overflow-hidden",
              keys[0]?.h === i ? "border-primary bg-primary/20 text-white" : "border-gray-800 bg-gray-900 text-gray-600"
            )}>
              {keys.filter(k => k.h === i).map(k => k.v.slice(0,3)).join(", ")}
            </div>
            <span className="text-[8px] font-mono text-gray-500">idx {i}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-end bg-black/30 p-4 rounded-xl">
        <input value={inputK} placeholder="Key" onChange={e => setInputK(e.target.value)} className="flex-1 bg-gray-800 border-2 border-gray-700 rounded p-1 text-white text-xs" />
        <input value={inputV} placeholder="Val" onChange={e => setInputV(e.target.value)} className="flex-1 bg-gray-800 border-2 border-gray-700 rounded p-1 text-white text-xs" />
        <Button onClick={insert} className="bg-primary h-8 font-bold text-[10px]">Hash</Button>
      </div>
    </VisualizerLayout>
  );
});

// ─── BINARY SEARCH VISUALIZATION ─────────────────────────────────────────────
const BinarySearchViz = forwardRef<VisualizerHandle>((_, ref) => {
  const nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const target = 23;
  const [l, setL] = useState(0);
  const [r, setR] = useState(nums.length - 1);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const mid = Math.floor((l + r) / 2);
  
  const code = [
    "while L <= R:",
    "  mid = (L + R) // 2",
    "  if nums[mid] == target: return mid",
    "  if nums[mid] < target: L = mid + 1",
    "  else: R = mid - 1"
  ];

  const getLine = () => {
    if (nums[mid] === target) return 2;
    if (step === 0 && !running) return 0;
    if (nums[mid] < target) return 3;
    return 4;
  };

  useImperativeHandle(ref, () => ({ run: () => { reset(); setRunning(true); } }));

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        if (nums[mid] === target) {
          setRunning(false);
          return;
        }
        next();
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [running, mid]);

  const next = () => {
    if (nums[mid] === target) return;
    if (nums[mid] < target) setL(mid + 1);
    else setR(mid - 1);
    setStep(s => s + 1);
  };

  const reset = () => { setL(0); setR(nums.length - 1); setStep(0); };

  return (
    <VisualizerLayout
      title={`Live: Binary Search (Target: ${target})`}
      code={code}
      activeLine={getLine()}
    >
      <div className="flex gap-1 mb-8 flex-wrap justify-center">
        {nums.map((n, i) => (
          <div key={i} className={cn(
            "w-9 h-9 flex items-center justify-center rounded border-2 font-black text-xs transition-all duration-500",
            i === mid ? "border-yellow-400 bg-yellow-400 text-black scale-110 z-10" :
            i < l || i > r ? "border-gray-800 bg-gray-900 text-gray-700" :
            "border-gray-600 bg-gray-800 text-white"
          )}>{n}</div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl border-2 border-gray-800">
        <div className="text-[10px] font-mono text-gray-500">L:{l} R:{r} M:{mid}</div>
        <div className="flex gap-2">
          <Button onClick={reset} size="sm" variant="outline" className="text-[10px] h-7">Reset</Button>
          <Button onClick={next} disabled={nums[mid] === target} className="bg-primary font-bold shadow-[3px_3px_0_0_#000] text-[10px] h-7 px-3">
            {nums[mid] === target ? "✓ Found" : "Next Mid"}
          </Button>
        </div>
      </div>
      {nums[mid] === target && (
        <div className="mt-4 p-4 bg-green-400/10 border-2 border-green-400 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Found at Index</span>
          <span className="text-xl font-black text-green-300 font-mono">{mid}</span>
        </div>
      )}
    </VisualizerLayout>
  );
});

// ─── STRINGS VISUALIZATION ──────────────────────────────────────────────────
const StringsViz = forwardRef<VisualizerHandle>((_, ref) => {
  const text = "ALGO POWER";
  const pattern = "POW";
  const [offset, setOffset] = useState(0);
  const [found, setFound] = useState(false);
  const [running, setRunning] = useState(false);
  
  const code = [
    "for i in range(len(text) - len(pattern) + 1):",
    "  if text[i : i+len(pattern)] == pattern:",
    "    return True",
    "return False"
  ];

  useImperativeHandle(ref, () => ({ run: () => { setOffset(0); setFound(false); setRunning(true); } }));

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        if (found || offset >= text.length - pattern.length) {
          setRunning(false);
          return;
        }
        shift();
      }, 600);
      return () => clearInterval(interval);
    }
  }, [running, offset, found]);

  const shift = () => {
    if (offset >= text.length - pattern.length) { setOffset(0); setFound(false); return; }
    const next = offset + 1;
    setOffset(next);
    if (text.slice(next, next + pattern.length) === pattern) setFound(true);
  };

  return (
    <VisualizerLayout
      title="Live: Naive String Matching"
      code={code}
      activeLine={found ? 2 : 1}
    >
      <div className="font-mono text-xl md:text-2xl tracking-[0.3em] text-white mb-6 flex justify-center bg-black/40 p-6 rounded-2xl border-2 border-gray-800">
        {text.split("").map((c, i) => (
          <span key={i} className={cn(
             i >= offset && i < offset + pattern.length ? (found ? "text-green-400 font-bold" : "text-primary border-b-4 border-primary") : "opacity-30"
          )}>{c === " " ? "\u00A0" : c}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {found ? "Match Found!" : `Scanning... offset ${offset}`}
        </div>
        <Button onClick={shift} className="bg-primary font-bold shadow-[3px_3px_0_0_#000] text-xs h-9 px-6">
          {found ? "Restart" : "Shift"}
        </Button>
      </div>
      {found && (
        <div className="mt-4 p-4 bg-green-400/10 border-2 border-green-400 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Pattern Match</span>
          <span className="text-sm font-black text-green-300 font-mono">Found at Offset {offset}</span>
        </div>
      )}
    </VisualizerLayout>
  );
});

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

const SectionLabel = ({ icon: Icon, label, onPlay }: { icon: any; label: string; onPlay?: () => void }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h2 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/70">{label}</h2>
    </div>
    {onPlay && (
      <Button 
        onClick={onPlay} 
        size="sm" 
        className="rounded-xl bg-primary text-white font-bold h-10 px-6 shadow-[4px_4px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all border-2 border-foreground uppercase tracking-widest text-[10px]"
      >
        <PlayCircle className="mr-2 h-4 w-4" /> Run Animation
      </Button>
    )}
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

  const vizRef = useRef<VisualizerHandle>(null);

  const VizComponent = {
    arrays: ArrayViz,
    "two-pointers": TwoPointerViz,
    "sliding-window": SlidingWindowViz,
    recursion: RecursionViz,
    "hash-map": HashMapViz,
    stack: StackViz,
    "binary-search": BinarySearchViz,
    strings: StringsViz,
  }[concept as string] as React.ComponentType<{ ref: React.Ref<VisualizerHandle> }> | undefined;

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
              <SectionLabel 
                icon={PlayCircle} 
                label="Interactive Visualization" 
                onPlay={() => vizRef.current?.run()}
              />
              <VizComponent ref={vizRef} />
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

export default Concept;
