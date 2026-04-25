// lib/fetchDailyQuote.ts
// -----------------------------------------------------------
// Calls the Gemini API to fetch a Stoic quotation
// that matches the user's daily goal and chosen Stoic quality.
//
// Returns the quote string on success, or "" on any failure
// so the app degrades gracefully (no quote shown).
// -----------------------------------------------------------

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function fetchDailyQuote(
  dailyGoal: string,
  chosenQuality: string,
  mood: number | null,
  physical: number | null,
  stressLevel: number | null,
): Promise<string> {
  try {
    const prompt = `
Your task: Select a REAL, VERBATIM paragraph from ONE of the following Stoic works:
- Meditations by Marcus Aurelius
- Discourses by Epictetus
- Letters from a Stoic by Seneca

The paragraph must be meaningfully and directly relevant to the user's daily goal:

Daily Goal: "${dailyGoal}"

STRICT REQUIREMENTS:

1. Use ONLY authentic text from the original works. Do NOT paraphrase, summarize, or modify wording.
2. Select a paragraph (3–6 sentences preferred) that clearly aligns with the user's goal.
3. Avoid overly generic quotes — prioritize strong thematic relevance.

OUTPUT FORMAT (follow exactly):

<paragraph text>

— <Author>, <Book Title>

Why <Author> shared this with you?
<One concise sentence explaining your reasoning on how the quote relates to the daily goal of the user, keep the tone in line with 'Why <Author> shared this with you?' title.>

QUALITY CHECK BEFORE FINALIZING:
- The quote must read naturally and be internally consistent (not stitched together).
- The connection must be specific, not generic.
- The output must strictly follow the format above.
`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(
        "Gemini API error:",
        response.status,
        await response.text(),
      );
      return "";
    }

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data).slice(0, 500));

    if (
      !data.candidates ||
      data.candidates.length === 0 ||
      !data.candidates[0].content?.parts?.[0]?.text
    ) {
      return "";
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch {
    return "";
  }
}
