import type { Concept, Problem, SkillProfile } from "./types";
import { PROBLEMS } from "@/data/problems";
import { weakestConcept } from "./store";

export async function evaluateCode(
  problem: Problem,
  userCode: string
): Promise<{
  verdict: "Accepted" | "Wrong Answer" | "Needs Improvement";
  confidence: number;
  issues: string[];
  optimization: string;
  explanation: string;
}> {
  if (!userCode || userCode.trim().length < 10) {
    return {
      verdict: "Needs Improvement",
      confidence: 100,
      issues: ["Code is empty or too short."],
      optimization: "N/A",
      explanation: "Please provide a valid implementation.",
    };
  }

  const prompt = `
    You are an expert DSA tutor. Evaluate the following user code for the problem: "${problem.title}".
    Problem Description: ${problem.description}
    User Code:
    ${userCode}

    Analyze the logic, complexity, and correctness. Do not execute the code.
    Return ONLY a JSON object with this structure:
    {
      "verdict": "Accepted" | "Wrong Answer" | "Needs Improvement",
      "confidence": number (0-100),
      "issues": string[],
      "optimization": string,
      "explanation": string
    }
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Evaluation failed", error);
    return {
      verdict: "Needs Improvement",
      confidence: 0,
      issues: ["Evaluation service unavailable."],
      optimization: "N/A",
      explanation: "Could not reach the evaluation engine.",
    };
  }
}

export function selectNextProblem(profile: SkillProfile, solvedIds: string[]): Problem {
  const weak = weakestConcept(profile.scores);
  return pickForConcept(profile, weak, solvedIds);
}

export function nextAfterSubmission(
  profile: SkillProfile,
  current: Problem,
  succeeded: boolean,
  solvedIds: string[],
): Problem {
  if (!succeeded) {
    return pickForConcept(profile, current.concept, solvedIds, "easier");
  }
  return pickForConcept(profile, current.concept, solvedIds, "harder");
}

function pickForConcept(
  profile: SkillProfile,
  concept: Concept,
  solvedIds: string[],
  pref: "easier" | "harder" | "auto" = "auto",
): Problem {
  const pool = PROBLEMS.filter((p) => p.concept === concept && !solvedIds.includes(p.id));
  const candidates = pool.length ? pool : PROBLEMS.filter((p) => p.concept === concept);

  let target: "easy" | "medium";
  if (pref === "easier") target = "easy";
  else if (pref === "harder") target = "medium";
  else {
    const stats = profile.stats[concept];
    const sr = stats.attempts > 0 ? stats.correct / stats.attempts : 0;
    target = stats.attempts === 0 || sr < 0.5 ? "easy" : "medium";
  }

  const exact = candidates.find((p) => p.difficulty === target);
  return exact ?? candidates[0];
}
