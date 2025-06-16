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

    const { videoIdea } = await req.json();

    if (!videoIdea) {
      return NextResponse.json(
        { error: 'Video idea is required' },
        { status: 400 }
      );
    }

    // Generate research sources using AI
    const prompt = `You are a research assistant. For the video idea "${videoIdea}", generate 4-6 relevant research sources that would help create an informative script.

For each source, provide:
- A realistic title for an article/resource
- A plausible URL (can be example.com based)
- A detailed snippet (2-3 sentences) with specific information relevant to the topic

Focus on sources that would provide:
- Statistics and data
- Expert insights
- How-to information
- Case studies or examples
- Current trends

Output as JSON array:
[
  {
    "title": "Article title here",
    "link": "https://example.com/article-url",
    "snippet": "Detailed snippet with specific information relevant to the video topic..."
  }
]`;

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
          maxOutputTokens: 2048,
          responseMimeType: "application/json"
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

    const sources = JSON.parse(result.candidates[0].content.parts[0].text);
    
    // Add IDs and mark as not extracted yet
    const sourcesWithIds = sources.map((source: any, index: number) => ({
      id: `source-${index}`,
      ...source,
      isTextExtracted: false
    }));
    
    return NextResponse.json({ sources: sourcesWithIds });
  } catch (error) {
    console.error('Error gathering sources:', error);
    
    // Return fallback sources
    const fallbackSources = [
      {
        id: 'fallback-1',
        title: `Research Guide: ${req.body?.videoIdea || 'Video Topic'}`,
        link: 'https://example.com/research-guide',
        snippet: 'Comprehensive guide with expert insights, statistics, and actionable strategies for creating engaging content.',
        isTextExtracted: false
      },
      {
        id: 'fallback-2',
        title: `Best Practices and Tips`,
        link: 'https://example.com/best-practices',
        snippet: 'Industry-leading practices and proven techniques used by successful content creators and experts.',
        isTextExtracted: false
      }
    ];
    
    return NextResponse.json({ sources: fallbackSources });
  }
} 