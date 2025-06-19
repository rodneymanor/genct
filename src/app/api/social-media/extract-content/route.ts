import { NextRequest, NextResponse } from 'next/server';

interface SocialMediaContent {
  platform: 'instagram' | 'tiktok';
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  author?: string;
  likes?: number;
  views?: number;
  duration?: number;
  extractedAt: string;
}

// Helper function to extract shortcode from Instagram URL
function extractInstagramShortcode(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagr\.am\/p\/([A-Za-z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper function to resolve TikTok short URLs to get actual video ID
async function resolveTikTokShortUrl(shortUrl: string): Promise<string | null> {
  try {
    console.log('🔍 Resolving TikTok short URL:', shortUrl);
    
    // Follow redirects to get the full URL
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'manual'
    });
    
    const location = response.headers.get('location');
    console.log('📍 Redirect location:', location);
    
    if (location) {
      // Extract video ID from the full URL
      const videoId = extractTikTokVideoId(location);
      console.log('🎬 Extracted video ID from redirect:', videoId);
      return videoId;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error resolving TikTok short URL:', error);
    return null;
  }
}

// Helper function to extract TikTok video ID from URL
function extractTikTokVideoId(url: string): string | null {
  const patterns = [
    /tiktok\.com\/@[^/]+\/video\/(\d+)/,
    /vm\.tiktok\.com\/([A-Za-z0-9]+)/,
    /tiktok\.com\/t\/([A-Za-z0-9]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Function to fetch Instagram content
async function fetchInstagramContent(shortcode: string): Promise<SocialMediaContent | null> {
  try {
    console.log('🔍 Fetching Instagram content for shortcode:', shortcode);
    
    const response = await fetch(
      `https://instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com/reel_by_shortcode?shortcode=${shortcode}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY || '7d8697833dmsh0919d85dc19515ap1175f7jsn0f8bb6dae84e',
          'x-rapidapi-host': 'instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com',
        },
      }
    );

    console.log('📡 Instagram API response status:', response.status);
    console.log('📡 Instagram API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.log('❌ Instagram API error status:', response.status);
      const errorText = await response.text();
      console.log('❌ Instagram API error body:', errorText);
      throw new Error(`Instagram API error: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('📄 Instagram API raw response:', responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.log('❌ Failed to parse Instagram API response as JSON:', parseError);
      console.log('📄 Full response text:', responseText);
      return null;
    }
    
    console.log('✅ Instagram API parsed data:', JSON.stringify(data, null, 2).substring(0, 1000));
    
    return {
      platform: 'instagram',
      url: `https://instagram.com/p/${shortcode}`,
      title: (typeof data.caption === 'string' ? data.caption : data.caption?.text) || 'Instagram Post',
      description: (typeof data.caption === 'string' ? data.caption : data.caption?.text) || '',
      thumbnail: data.thumbnail_url,
      author: data.username,
      likes: data.like_count,
      views: data.view_count,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Error fetching Instagram content:', error);
    return null;
  }
}

// Function to fetch TikTok content
async function fetchTikTokContent(videoId: string): Promise<SocialMediaContent | null> {
  try {
    console.log('🔍 Fetching TikTok content for video ID:', videoId);
    
    const response = await fetch(
      `https://tiktok-scrapper-videos-music-challenges-downloader.p.rapidapi.com/video/${videoId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY || '7d8697833dmsh0919d85dc19515ap1175f7jsn0f8bb6dae84e',
          'x-rapidapi-host': 'tiktok-scrapper-videos-music-challenges-downloader.p.rapidapi.com',
        },
      }
    );

    console.log('📡 TikTok API response status:', response.status);
    console.log('📡 TikTok API response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 TikTok API raw response:', responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.log('❌ Failed to parse TikTok API response as JSON:', parseError);
      console.log('📄 Full response text:', responseText);
      return null;
    }
    
    console.log('✅ TikTok API parsed data:', JSON.stringify(data, null, 2).substring(0, 1000));

    // Check if the API returned an error
    if (data.status === 'error' || !response.ok) {
      console.log('❌ TikTok API returned error:', data.error || `HTTP ${response.status}`);
      return null;
    }

    // Check if we have the required data
    if (!data.author || !data.desc) {
      console.log('❌ TikTok API response missing required fields');
      return null;
    }

    return {
      platform: 'tiktok',
      url: `https://tiktok.com/@${data.author?.unique_id}/video/${videoId}`,
      title: data.desc || 'TikTok Video',
      description: data.desc,
      thumbnail: data.video?.cover,
      author: data.author?.nickname,
      likes: data.statistics?.digg_count,
      views: data.statistics?.play_count,
      duration: data.video?.duration,
      extractedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Error fetching TikTok content:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    const results: (SocialMediaContent | null)[] = [];

    for (const url of urls) {
      if (typeof url !== 'string') {
        results.push(null);
        continue;
      }

      // Check if it's an Instagram URL
      if (url.includes('instagram.com') || url.includes('instagr.am')) {
        const shortcode = extractInstagramShortcode(url);
        if (shortcode) {
          const content = await fetchInstagramContent(shortcode);
          results.push(content);
        } else {
          results.push(null);
        }
      }
      // Check if it's a TikTok URL
      else if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) {
        let videoId = extractTikTokVideoId(url);
        console.log('🔍 Extracted TikTok video ID from URL:', url, '-> ID:', videoId);
        
        // If it's a short URL format (non-numeric), try to resolve it
        if (videoId && !/^\d+$/.test(videoId)) {
          console.log('🔄 Detected short URL format, attempting to resolve...');
          const resolvedVideoId = await resolveTikTokShortUrl(url);
          if (resolvedVideoId && /^\d+$/.test(resolvedVideoId)) {
            videoId = resolvedVideoId;
            console.log('✅ Resolved to numeric video ID:', videoId);
          } else {
            console.log('❌ Failed to resolve to numeric video ID');
          }
        }
        
        if (videoId && /^\d+$/.test(videoId)) {
          const content = await fetchTikTokContent(videoId);
          results.push(content);
        } else {
          console.log('❌ No valid numeric video ID found for TikTok URL:', url);
          results.push(null);
        }
      }
      else {
        results.push(null);
      }
    }

    const successfulExtractions = results.filter(result => result !== null);
    
    return NextResponse.json({
      success: true,
      extracted: successfulExtractions,
      total: urls.length,
      successful: successfulExtractions.length,
    });

  } catch (error) {
    console.error('Error in extract-content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 