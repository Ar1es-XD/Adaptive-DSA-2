import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Concept, SkillProfile } from "./types";
import { CONCEPTS } from "./types";

const emptyStats = () =>
  CONCEPTS.reduce((acc, c) => ({ ...acc, [c]: { attempts: 0, correct: 0 } }), {} as SkillProfile["stats"]);
const emptyScores = () =>
  CONCEPTS.reduce((acc, c) => ({ ...acc, [c]: 0 }), {} as Record<Concept, number>);

interface TutorState {
  diagnosticDone: boolean;
  profile: SkillProfile;
  plan: string | null;
  setDiagnostic: (scores: Record<Concept, number>) => void;
  setPlan: (plan: string) => void;
  recordAttempt: (concept: Concept, correct: boolean) => void;
  reset: () => void;
}

export const useTutorStore = create<TutorState>()(
  persist(
    (set) => ({
      diagnosticDone: false,
      profile: { scores: emptyScores(), stats: emptyStats() },
      plan: null,
      setDiagnostic: (scores) =>
        set((s) => ({
          diagnosticDone: true,
          profile: { ...s.profile, scores },
        })),
      setPlan: (plan) => set({ plan }),
      recordAttempt: (concept, correct) =>
        set((s) => {
          const stats = { ...s.profile.stats };
          stats[concept] = {
            attempts: stats[concept].attempts + 1,
            correct: stats[concept].correct + (correct ? 1 : 0),
          };
          // Adjust score: blend diagnostic with practice success rate
          const sr = stats[concept].attempts > 0 ? (stats[concept].correct / stats[concept].attempts) * 100 : 0;
          const blended = Math.round(0.5 * s.profile.scores[concept] + 0.5 * sr);
          const scores = { ...s.profile.scores, [concept]: blended };
          return { profile: { scores, stats } };
        }),
      reset: () =>
        set({
          diagnosticDone: false,
          profile: { scores: emptyScores(), stats: emptyStats() },
          plan: null,
        }),
    }),
    { name: "dsa-tutor-state" },
  ),
);

export const weakestConcept = (scores: Record<Concept, number>): Concept => {
  let min: Concept = "arrays";
  let mv = Infinity;
  for (const c of CONCEPTS) if (scores[c] < mv) { mv = scores[c]; min = c; }
  return min;
};

export const strongestConcept = (scores: Record<Concept, number>): Concept => {
  let max: Concept = "arrays";
  let mv = -Infinity;
  for (const c of CONCEPTS) if (scores[c] > mv) { mv = scores[c]; max = c; }
  return max;
};
