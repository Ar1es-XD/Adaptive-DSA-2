// AI assistant: debug mode and hint mode (3 strict levels). Never returns full solutions.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HINT_PROMPTS: Record<number, string> = {
  1: "Give a CONCEPT hint only. Name the high-level technique/idea applicable. 1-2 sentences. Do NOT mention code, variables, or implementation steps.",
  2: "Give a PATTERN hint. Describe the general algorithmic pattern (e.g. 'two pointers from both ends'), no code, no specific variable names. 2-3 sentences.",
  3: "Give a STRUCTURAL hint. Outline the high-level steps in plain English (no actual code). Do NOT write the solution. 3-5 short bullet points maximum.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { mode, problem, code, language, result, hintLevel } = body as {
      mode: "debug" | "hint" | "simulate";
      problem?: { title: string; description: string };
      code?: string;
      language?: string;
      result?: string;
      hintLevel?: 1 | 2 | 3;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let sys = "";
    let user = "";

    if (mode === "simulate") {
      sys = `You are a strict, deterministic code execution engine simulator. 
You must output EXACTLY what the standard output (STDOUT) and standard error (STDERR) of the provided code would be.
DO NOT provide explanations, reviews, conversational text, or markdown formatting. 
ONLY output the raw simulated terminal output. If there is a syntax or runtime error, output the exact error message.`;
      user = `Language: ${language}\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\nSimulate execution.`;
    } else if (mode === "debug") {
      sys = `You are a DSA tutor in DEBUG mode. The user is stuck. Analyze their code and the result. 
Output MARKDOWN with EXACTLY these sections:
### What's wrong
### Where logic fails
### How to fix
STRICT RULE: Do NOT provide a full corrected solution. No complete code blocks. Only short snippets (≤3 lines) when illustrating a fix concept. Be concise.`;
      user = `Problem: ${problem?.title}\n${problem?.description}\n\nLanguage: ${language}\nUser code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nResult/verdict: ${result ?? "no run yet"}\n\nDebug it.`;
    } else {
      const lvl = hintLevel ?? 1;
      sys = `You are a DSA tutor in HINT mode. ${HINT_PROMPTS[lvl]} STRICT RULE: NEVER reveal the full solution. NEVER write a complete function body. Output MARKDOWN.`;
      user = `Problem: ${problem?.title}\n${problem?.description}\n\nProvide a Level ${lvl} hint only.`;
    }

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      }),
    });

    if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached, try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) {
      console.error("AI error", r.status, await r.text());
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ content }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
