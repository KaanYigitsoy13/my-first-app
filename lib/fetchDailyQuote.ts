// lib/fetchDailyQuote.ts
// -----------------------------------------------------------
// Calls the Gemini API to fetch a Marcus Aurelius quotation
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
    const prompt = `You return exact quotes from Marcus Aurelius' Book: Meditations. Do not add commentary, explanation, or paraphrasing.

The user did a morning reflection and has set a daily goal: '${dailyGoal}'. They have chosen a quality to embody today as well: '${chosenQuality}'.

Your task: Consider User's daily goal and chosen quality. Select the single most appropriate paragraph from Marcus Aurelius' Book: Meditations.

Output rules: Return ONLY the paragraph text itself — no commentary, no explanation. Just the raw paragraph from the text and add an attribution line as 'Book X, Section Y'.`;

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
