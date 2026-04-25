// AI evaluation of an open-ended diagnostic answer.
// Returns: { correct: boolean, understanding: "low"|"medium"|"high", feedback: string }
// Deterministic (temperature=0) and uses tool-calling for strict JSON.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  kind: "logical" | "conceptual" | "coding";
  concept: string;
  prompt: string;
  referenceAnswer: string;
  referenceReasoning?: string;
  userAnswer: string;
  userReasoning?: string;
  language?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as RequestBody;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { kind, concept, prompt, referenceAnswer, referenceReasoning, userAnswer, userReasoning, language } = body;

    // Quick guard: empty answer
    if (!userAnswer || userAnswer.trim().length < 2) {
      return new Response(
        JSON.stringify({
          correct: false,
          understanding: "low",
          feedback: "No meaningful answer was provided.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const sys = `You are a strict, deterministic DSA tutor evaluating a student's diagnostic answer.
You measure HOW THE STUDENT THINKS, not memorization. Be objective and consistent — same input must yield same output.

Question type is "${kind}":
- "logical": evaluate whether the student's described strategy is correct, clear, and shows reasoning. The exact wording does not need to match the reference; equivalent correct ideas count.
- "conceptual": evaluate whether the student's explanation captures the core idea. Partial but correct explanations can still be "correct: true" with "medium" understanding.
- "coding": evaluate the code's logical correctness against the reference. Do NOT execute it — reason about it. Different but correct implementations are fine.

You MUST call the submit_evaluation tool with this JSON shape:
{
  "correct": boolean,        // overall: did the student arrive at a correct answer/strategy?
  "understanding": "low" | "medium" | "high",  // depth of thinking shown
  "feedback": string         // 1-3 sentences, concrete, specific, kind. For coding answers, mention any logic gaps.
}

Rules for "understanding":
- "high": correct AND explained/justified clearly with insight into WHY.
- "medium": correct or mostly correct but reasoning is shallow / missing edge cases / mechanical.
- "low": incorrect, off-topic, vague, or shows misconception.

Never reveal the reference answer in feedback. Do not be encouraging if the answer is wrong — be honest and specific.`;

    const user = `Concept: ${concept}
Question type: ${kind}
${language ? `Language: ${language}\n` : ""}
Question:
${prompt}

Reference (correct) answer (private — do not reveal):
${referenceAnswer}
${referenceReasoning ? `\nReference reasoning (private):\n${referenceReasoning}\n` : ""}

Student's answer:
${userAnswer}
${userReasoning ? `\nStudent's reasoning:\n${userReasoning}\n` : ""}

Evaluate.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "submit_evaluation",
          description: "Return the structured evaluation of the student's answer",
          parameters: {
            type: "object",
            properties: {
              correct: { type: "boolean" },
              understanding: { type: "string", enum: ["low", "medium", "high"] },
              feedback: { type: "string" },
            },
            required: ["correct", "understanding", "feedback"],
            additionalProperties: false,
          },
        },
      },
    ];

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "submit_evaluation" } },
        temperature: 0,
      }),
    });

    if (r.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached, try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (r.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!r.ok) {
      const t = await r.text();
      console.error("AI gateway error", r.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await r.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      const txt = data.choices?.[0]?.message?.content ?? "";
      console.error("No tool call. Content:", txt);
      return new Response(
        JSON.stringify({
          correct: false,
          understanding: "low",
          feedback: txt || "Could not evaluate the answer.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const args = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-diagnostic error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
