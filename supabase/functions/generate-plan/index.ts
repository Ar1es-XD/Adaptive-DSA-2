// Generates a personalized 2-3 day study plan based on diagnostic scores.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { scores } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const sys = `You are a DSA tutor. Given the user's diagnostic scores per concept (0-100), produce a concise, actionable 2-3 day study plan.
Return MARKDOWN only. Be brief and structured. Use headings: ## Focus Areas, ## 2-3 Day Plan, ## Recommended Practice. No fluff.`;

    const user = `Diagnostic scores:
- Arrays: ${scores.arrays}%
- Two Pointers: ${scores["two-pointers"]}%
- Sliding Window: ${scores["sliding-window"]}%
- Recursion: ${scores.recursion}%

Generate the plan. Prioritize the lowest-scoring concepts. Keep total under 250 words.`;

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
      const t = await r.text();
      console.error("AI error", r.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const plan = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ plan }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
