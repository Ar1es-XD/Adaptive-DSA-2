// Code evaluation via Gemini. NO real execution. Heuristic checks + AI reasoning. Deterministic (temperature=0).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Heuristics {
  empty: boolean;
  hasLoop: boolean;
  hasRecursion: boolean;
  hasMap: boolean;
  hasReturn: boolean;
  lineCount: number;
}

function heuristics(code: string, fnHints: string[]): Heuristics {
  const trimmed = code.trim();
  const empty = trimmed.length === 0 || /^(\/\/|#).*pass\s*$|^\s*pass\s*$/m.test(trimmed) && trimmed.split("\n").length < 4;
  const hasLoop = /\b(for|while)\b/.test(code);
  const hasMap = /\b(Map|HashMap|dict|\{\s*\}|new\s+Map|unordered_map)\b/.test(code);
  const hasReturn = /\breturn\b/.test(code);
  // Crude recursion detection: any function name appearing twice in code
  const hasRecursion = fnHints.some((fn) => {
    const re = new RegExp(`\\b${fn}\\b`, "g");
    const m = code.match(re);
    return m !== null && m.length >= 2;
  });
  return { empty, hasLoop, hasRecursion, hasMap, hasReturn, lineCount: trimmed.split("\n").length };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { problem, code, language, expectedBehavior } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const h = heuristics(code ?? "", [problem?.fnName ?? "", "solve", "helper"].filter(Boolean));

    if (h.empty || (h.lineCount < 3 && !h.hasReturn)) {
      return new Response(JSON.stringify({
        verdict: "Wrong Answer",
        confidence: 100,
        issues: ["Submitted code is empty or contains no implementation."],
        optimization: "N/A — no code to evaluate.",
        explanation: "Please write a solution before submitting. The function body appears empty.",
        heuristics: h,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sys = `You are a strict, deterministic DSA code reviewer. You DO NOT execute code — you reason about its logic.
Analyze the user's code against the problem description and expected behavior.

You MUST return a SINGLE JSON object via the provided tool. Rules:
- "verdict" is one of: "Accepted", "Wrong Answer", "Needs Improvement"
  • "Accepted" — logic is correct, handles edge cases, reasonably efficient
  • "Wrong Answer" — logic is incorrect / fails on plausible inputs
  • "Needs Improvement" — logic is mostly correct but has issues (inefficient, missed edge case, style)
- "confidence" is an integer 0-100 reflecting your certainty
- "issues" is an array of short concrete problems (empty array if none)
- "optimization" describes whether time/space complexity is optimal for this problem
- "explanation" is a clear 2-4 sentence reasoning. Identify edge cases. Be specific. Do NOT hallucinate execution traces.
- Be CONSISTENT: same code → same verdict. Be objective.`;

    const user = `Problem: ${problem.title}
Description: ${problem.description}
Expected behavior: ${expectedBehavior}
Difficulty: ${problem.difficulty}
Concept: ${problem.concept}

Static heuristics detected: loop=${h.hasLoop}, recursion=${h.hasRecursion}, map/dict=${h.hasMap}, return=${h.hasReturn}, lines=${h.lineCount}.

Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Evaluate the code's logical correctness, edge case handling, and optimization.`;

    const tools = [{
      type: "function",
      function: {
        name: "submit_evaluation",
        description: "Return the structured code evaluation",
        parameters: {
          type: "object",
          properties: {
            verdict: { type: "string", enum: ["Accepted", "Wrong Answer", "Needs Improvement"] },
            confidence: { type: "integer", minimum: 0, maximum: 100 },
            issues: { type: "array", items: { type: "string" } },
            optimization: { type: "string" },
            explanation: { type: "string" },
          },
          required: ["verdict", "confidence", "issues", "optimization", "explanation"],
          additionalProperties: false,
        },
      },
    }];

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: user }],
        tools,
        tool_choice: { type: "function", function: { name: "submit_evaluation" } },
        temperature: 0,
      }),
    });

    if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached, try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) {
      console.error("AI error", r.status, await r.text());
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await r.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      const txt = data.choices?.[0]?.message?.content ?? "";
      console.error("No tool call returned. Content:", txt);
      return new Response(JSON.stringify({
        verdict: "Needs Improvement",
        confidence: 50,
        issues: ["AI did not return structured output."],
        optimization: "Unknown",
        explanation: txt || "Could not parse evaluation.",
        heuristics: h,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const args = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ ...args, heuristics: h }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
