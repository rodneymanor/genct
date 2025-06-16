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

    const { sources } = await req.json();

    if (!sources || !Array.isArray(sources)) {
      return NextResponse.json(
        { error: 'Sources array is required' },
        { status: 400 }
      );
    }

    // Extract content from each source
    const extractedSources = await Promise.all(
      sources.map(async (source: any) => {
        try {
          // Simulate content extraction using AI to expand the snippet
          const prompt = `Based on this source information, generate detailed extracted content that would be found in the full article:

Title: ${source.title}
URL: ${source.link}
Snippet: ${source.snippet}

Generate 3-4 paragraphs of detailed content that would logically be found in this article. Include:
- Specific data, statistics, or numbers when relevant
- Actionable advice or steps
- Expert quotes or insights
- Examples or case studies

Make it informative and relevant to the topic while maintaining the tone suggested by the title and snippet.`;

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
                maxOutputTokens: 1024
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

          const extractedText = result.candidates[0].content.parts[0].text;

          return {
            ...source,
            extractedText,
            isTextExtracted: true
          };
        } catch (error) {
          console.error(`Error extracting content for ${source.title}:`, error);
          
          // Fallback: use expanded snippet
          return {
            ...source,
            extractedText: `${source.snippet}\n\nThis source provides valuable insights and detailed information relevant to the topic. The content includes expert analysis, practical tips, and actionable strategies that can be used to create engaging and informative video content.`,
            isTextExtracted: false,
            textExtractionError: 'Content extraction failed, using expanded snippet'
          };
        }
      })
    );

    return NextResponse.json({ sources: extractedSources });
  } catch (error) {
    console.error('Error in content extraction:', error);
    return NextResponse.json(
      { error: 'Failed to extract content from sources' },
      { status: 500 }
    );
  }
} 