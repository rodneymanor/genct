import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { videoIdea, selectedComponents } = await req.json();

    if (!videoIdea || !selectedComponents) {
      return NextResponse.json(
        { error: 'Video idea and selected components are required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert scriptwriter. Assemble the following components into a cohesive, engaging short-form video script.

Video Idea: "${videoIdea}"

Selected Components:
HOOK: ${selectedComponents.hook?.content || ''}
BRIDGE: ${selectedComponents.bridge?.content || ''}
GOLDEN NUGGET: ${selectedComponents.goldenNugget?.content || ''}
CALL TO ACTION: ${selectedComponents.wta?.content || ''}

Create a natural, flowing script that seamlessly connects these components. The script should:
- Start with the hook to grab attention immediately
- Use the bridge to transition smoothly to the main content
- Present the golden nugget as valuable, actionable content
- End with a compelling call to action

Write in a conversational, engaging tone suitable for social media video content.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const finalScript = result.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ finalScript });
  } catch (error) {
    console.error('Error generating final script:', error);
    return NextResponse.json(
      { error: 'Failed to generate final script' },
      { status: 500 }
    );
  }
} 