// AI evaluation of an open-ended diagnostic answer.
// Acts like a sharp DSA mentor: reacts to what the student actually wrote.
// Returns:
// {
//   status: "correct" | "partial" | "incorrect",
//   understanding: "low" | "medium" | "high",
//   feedback: string,        // 1-2 sentences, references the user's actual answer
//   didWell?: string,        // 1 line, what they did well (if anything)
//   missing?: string         // 1 line, what's missing (if not fully correct)
// }

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
          status: "incorrect",
          understanding: "low",
          feedback: "You didn't actually answer the question — share your thinking even if you're unsure.",
          missing: "Any attempt to engage with the problem.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const sys = `You are a sharp, no-nonsense DSA mentor evaluating a student's thinking. You sound like a real interviewer — direct, specific, human. Never robotic, never generic.

You receive the question, the reference (private) answer, and the student's actual answer + reasoning. Your job is to react to WHAT THE STUDENT ACTUALLY WROTE.

Question type: "${kind}"
- "logical": judge whether their described reasoning is sound. Equivalent correct ideas count even if worded differently.
- "conceptual": judge whether they conveyed the core intuition, not memorized phrases.
- "coding": reason about the code's logic. Do NOT execute it. Different correct implementations are fine.

Call submit_evaluation with this JSON shape:
{
  "status": "correct" | "partial" | "incorrect",
  "understanding": "low" | "medium" | "high",
  "feedback": string,    // 1-2 sentences MAX. MUST quote or reference what the student wrote. Explain WHY it's right/wrong. Sound like a person.
  "didWell": string,     // OPTIONAL. 1 line. Specific thing they got right. Omit if nothing notable.
  "missing": string      // OPTIONAL but REQUIRED if status != "correct". 1 line. The exact key idea they missed — never just "too short".
}

GOOD feedback examples:
- "You said 'comparisons double' — exactly right, because each new element is checked once, so work scales linearly."
- "You wrote 'O(n)' but didn't say WHY — the key idea is that each element is touched a constant number of times."
- "Your loop only checks nums[i] vs nums[0], not nums[i+1] — you're not actually checking consecutive pairs."

BAD (never do this):
- "Good job!" / "Correct."
- "Your answer is too short."
- "Try to elaborate more."
- "You showed some understanding."

Understanding levels:
- "high": correct AND shows insight into WHY (mechanism, not just outcome).
- "medium": correct or close, but mechanical / shallow / missing edge cases.
- "low": wrong, off-topic, vague, or shows misconception.

Status levels:
- "correct": the core answer is right and the reasoning is sound enough.
- "partial": right idea but missing a key piece, OR correct answer with weak reasoning.
- "incorrect": wrong answer or fundamentally wrong reasoning.

Never reveal the reference answer in feedback. Be honest, not encouraging.`;

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
              status: { type: "string", enum: ["correct", "partial", "incorrect"] },
              understanding: { type: "string", enum: ["low", "medium", "high"] },
              feedback: { type: "string" },
              didWell: { type: "string" },
              missing: { type: "string" },
            },
            required: ["status", "understanding", "feedback"],
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
          status: "incorrect",
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
