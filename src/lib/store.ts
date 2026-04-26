import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Badge, Concept, SkillProfile } from "./types";
import { CONCEPTS } from "./types";

const emptyStats = () =>
  CONCEPTS.reduce((acc, c) => ({ ...acc, [c]: { attempts: 0, correct: 0 } }), {} as SkillProfile["stats"]);
const emptyScores = () =>
  CONCEPTS.reduce((acc, c) => ({ ...acc, [c]: 0 }), {} as Record<Concept, number>);

const BADGE_DEFS: Omit<Badge, "unlockedAt">[] = [
  { id: "first-blood", label: "First Blood", description: "Solved your first problem", icon: "🎯" },
  { id: "streak-3", label: "On a Roll", description: "3-day activity streak", icon: "🔥" },
  { id: "streak-7", label: "Week Warrior", description: "7-day activity streak", icon: "⚡" },
  { id: "arrays-master", label: "Arrays Master", description: "Solved all Array problems", icon: "📦" },
  { id: "century", label: "Century Club", description: "Solved 10 problems", icon: "💯" },
  { id: "speed-demon", label: "Speed Demon", description: "Got Accepted on first try", icon: "🚀" },
];

interface User { name: string; email: string; }

interface TutorState {
  user: User | null;
  diagnosticDone: boolean;
  diagnosticRounds: number;   // how many times diagnostic has been completed
  profile: SkillProfile;
  plan: string | null;
  points: number;
  streak: number;
  lastActiveDate: string | null;
  badges: Badge[];
  setUser: (user: User) => void;
  signOut: () => void;
  setDiagnostic: (scores: Record<Concept, number>) => void;
  incrementDiagnosticRound: (scores: Record<Concept, number>) => void; // re-test: blend scores
  setPlan: (plan: string) => void;
  recordAttempt: (concept: Concept, correct: boolean, problemId?: string) => void;
  awardPoints: (pts: number) => void;
  checkAndUpdateStreak: () => void;
  reset: () => void;
}

const todayISO = () => new Date().toISOString().split("T")[0];
const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

export const useTutorStore = create<TutorState>()(
  persist(
    (set, get) => ({
      user: null,
      diagnosticDone: false,
      diagnosticRounds: 0,
      profile: { scores: emptyScores(), stats: emptyStats(), solvedIds: [] },
      plan: null,
      points: 0,
      streak: 0,
      lastActiveDate: null,
      badges: [],
      setUser: (user) => set({ user }),
      signOut: () => set({ user: null, diagnosticDone: false, diagnosticRounds: 0, profile: { scores: emptyScores(), stats: emptyStats(), solvedIds: [] }, plan: null, points: 0, streak: 0, lastActiveDate: null, badges: [] }),

      setDiagnostic: (scores) =>
        set((s) => ({ diagnosticDone: true, diagnosticRounds: 1, profile: { ...s.profile, scores } })),

      // Re-test: blend new scores with existing (proportional to rounds completed)
      incrementDiagnosticRound: (newScores) =>
        set((s) => {
          const weight = 1 / (s.diagnosticRounds + 1); // new result weighted less each round
          const blended = Object.fromEntries(
            Object.keys(newScores).map(c => [
              c,
              Math.round((1 - weight) * (s.profile.scores[c as Concept] ?? 0) + weight * newScores[c as Concept])
            ])
          ) as Record<Concept, number>;
          return {
            diagnosticRounds: s.diagnosticRounds + 1,
            profile: { ...s.profile, scores: blended },
          };
        }),

      setPlan: (plan) => set({ plan }),

      awardPoints: (pts) => set((s) => ({ points: s.points + pts })),

      checkAndUpdateStreak: () => {
        const today = todayISO();
        const yesterday = yesterdayISO();
        set((s) => {
          if (s.lastActiveDate === today) return {}; // already counted today
          const newStreak = s.lastActiveDate === yesterday ? s.streak + 1 : 1;
          const newBadges = [...s.badges];
          if (newStreak >= 3 && !newBadges.find(b => b.id === "streak-3")) {
            newBadges.push({ ...BADGE_DEFS.find(b => b.id === "streak-3")!, unlockedAt: Date.now() });
          }
          if (newStreak >= 7 && !newBadges.find(b => b.id === "streak-7")) {
            newBadges.push({ ...BADGE_DEFS.find(b => b.id === "streak-7")!, unlockedAt: Date.now() });
          }
          return { streak: newStreak, lastActiveDate: today, badges: newBadges };
        });
      },

      recordAttempt: (concept, correct, problemId) =>
        set((s) => {
          const stats = { ...s.profile.stats };
          stats[concept] = {
            attempts: stats[concept].attempts + 1,
            correct: stats[concept].correct + (correct ? 1 : 0),
          };

          const solvedIds = [...s.profile.solvedIds];
          const isNewSolve = correct && problemId && !solvedIds.includes(problemId);
          if (isNewSolve) solvedIds.push(problemId!);

          const sr = stats[concept].attempts > 0 ? (stats[concept].correct / stats[concept].attempts) * 100 : 0;
          const blended = Math.round(0.5 * s.profile.scores[concept] + 0.5 * sr);
          const scores = { ...s.profile.scores, [concept]: blended };

          // Badge checks
          const newBadges = [...s.badges];
          const totalSolved = solvedIds.length;

          if (totalSolved === 1 && !newBadges.find(b => b.id === "first-blood")) {
            newBadges.push({ ...BADGE_DEFS.find(b => b.id === "first-blood")!, unlockedAt: Date.now() });
          }
          if (totalSolved >= 10 && !newBadges.find(b => b.id === "century")) {
            newBadges.push({ ...BADGE_DEFS.find(b => b.id === "century")!, unlockedAt: Date.now() });
          }
          if (correct && stats[concept].correct === 1 && stats[concept].attempts === 1 && !newBadges.find(b => b.id === "speed-demon")) {
            newBadges.push({ ...BADGE_DEFS.find(b => b.id === "speed-demon")!, unlockedAt: Date.now() });
          }

          return {
            profile: { scores, stats, solvedIds },
            badges: newBadges,
          };
        }),

      reset: () =>
        set({
          user: null,
          diagnosticDone: false,
          profile: { scores: emptyScores(), stats: emptyStats(), solvedIds: [] },
          plan: null,
          points: 0,
          streak: 0,
          lastActiveDate: null,
          badges: [],
        }),
    }),
    { name: "dsa-tutor-state" },
  ),
);

export const weakestConcept = (scores: Record<Concept, number>): Concept => {
  // Only consider concepts that have problems
  const active: Concept[] = ["arrays", "two-pointers", "sliding-window", "recursion", "hash-map", "stack", "binary-search", "strings"];
  let min: Concept = "arrays";
  let mv = Infinity;
  for (const c of active) if (scores[c] < mv) { mv = scores[c]; min = c; }
  return min;
};

export const strongestConcept = (scores: Record<Concept, number>): Concept => {
  let max: Concept = "arrays";
  let mv = -Infinity;
  for (const c of CONCEPTS) if (scores[c] > mv) { mv = scores[c]; max = c; }
  return max;
};
