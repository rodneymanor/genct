import { NextRequest } from "next/server";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";

function createFinalScriptPrompt(videoIdea: string, selectedComponents: any) {
  return `
Create a compelling script for this video idea: "${videoIdea}"

Use these selected components:

Selected Components:
HOOK: ${selectedComponents.hook?.content ?? ""}
BRIDGE: ${selectedComponents.bridge?.content ?? ""}
GOLDEN NUGGET: ${selectedComponents.goldenNugget?.content ?? ""}
CALL TO ACTION: ${selectedComponents.wta?.content ?? ""}

Instructions:
1. Create a cohesive, engaging script that flows naturally
2. Integrate all selected components seamlessly
3. Ensure the script is conversational and engaging
4. Keep the tone appropriate for the target audience
5. Make sure the call-to-action feels natural and not forced

Format the response as a complete script ready for recording.
`;
}

async function callGeminiAPI(prompt: string) {
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to call Gemini API");
  }

  const data = await response.json();

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Invalid response from Gemini API");
  }

  return data.candidates[0].content.parts[0].text;
}

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  const { videoIdea, selectedComponents } = await req.json();

  if (!videoIdea || !selectedComponents) {
    return Response.json({ error: "Video idea and selected components are required" }, { status: 400 });
  }

  try {
    const prompt = createFinalScriptPrompt(videoIdea, selectedComponents);
    const finalScript = await callGeminiAPI(prompt);

    return Response.json({ finalScript });
  } catch (error) {
    console.error("Error generating final script:", error);
    return Response.json({ error: "Failed to generate final script" }, { status: 500 });
  }
}
