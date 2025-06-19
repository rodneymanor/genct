import { NextRequest, NextResponse } from 'next/server';

import { collection, addDoc, getDocs, query, where, limit, Timestamp } from 'firebase/firestore';

import { db } from '@/lib/firebase';

interface EmailData {
  from: string;
  to: string;
  subject: string;
  body: string;
  userId?: string; // Will be determined from email alias
}

interface ProcessedLink {
  url: string;
  platform: 'instagram' | 'tiktok' | 'other';
  extracted: boolean;
  content?: any;
}

// Helper function to extract social media links from email content
function extractSocialMediaLinks(content: string): string[] {
  const patterns = [
    /https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/[^\s]+/gi,
    /https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/[^\s]+/gi,
  ];
  
  const links: string[] = [];
  patterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      links.push(...matches);
    }
  });
  
  // Remove duplicates
  return [...new Set(links)];
}

// Helper function to determine platform from URL
function getPlatformFromUrl(url: string): 'instagram' | 'tiktok' | 'other' {
  if (url.includes('instagram.com') || url.includes('instagr.am')) {
    return 'instagram';
  } else if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) {
    return 'tiktok';
  }
  return 'other';
}

// Helper function to find user by email alias (simplified - in real implementation you'd have user alias mapping)
async function findUserByEmailAlias(emailAlias: string): Promise<string | null> {
  try {
    console.log('🔍 findUserByEmailAlias called with:', emailAlias);
    
    // For demo purposes, handle the format: {userId}@gencapp.pro
    if (emailAlias.includes('@gencapp.pro')) {
      const userId = emailAlias.split('@')[0];
      console.log('📧 Extracted userId from email:', userId, 'Length:', userId.length);
      
      // Validate that this is a real user ID by checking if they exist in auth
      // In a real implementation, you'd have a proper user_aliases collection
      // For now, we'll accept any format that looks like a valid user ID
      if (userId && userId.length > 10) { // Basic validation for Firebase UID format
        console.log('✅ Valid userId format, returning:', userId);
        return userId;
      } else {
        console.log('❌ Invalid userId format or too short');
      }
    }
    
    // Handle specific known aliases
    if (emailAlias === 'rodney@gencapp.pro') {
      console.log('✅ Found known alias for rodney, returning hardcoded userId');
      // Return the known user ID for the main user
      return 'RDY3YfpuY5ppYEzj0kpGFFVCSHpr'; // This should match the actual user ID
    }
    
    console.log('🔍 Checking database for emailAlias:', emailAlias);
    // In a real implementation, you'd query a user_aliases collection
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('emailAlias', '==', emailAlias), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const foundUserId = querySnapshot.docs[0].id;
      console.log('✅ Found user in database:', foundUserId);
      return foundUserId;
    }
    
    console.log('❌ No user found for email alias');
    return null;
  } catch (error) {
    console.error('Error finding user by email alias:', error);
    return null;
  }
}

// Helper function to get or create default collection
async function getOrCreateDefaultCollection(userId: string): Promise<string> {
  try {
    // Look for existing "Email Inbox" collection
    const collectionsRef = collection(db, 'collections');
    const q = query(
      collectionsRef, 
      where('userId', '==', userId),
      where('name', '==', 'Email Inbox'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    
    // Create default collection
    const newCollectionRef = await addDoc(collectionsRef, {
      name: 'Email Inbox',
      description: 'Links received via email',
      userId,
      items: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      itemCount: 0,
      color: 'bg-purple-100',
    });
    
    return newCollectionRef.id;
  } catch (error) {
    console.error('Error getting/creating default collection:', error);
    throw error;
  }
}

// POST - Process incoming email with social media links
export async function POST(request: NextRequest) {
  try {
    const emailData: EmailData = await request.json();
    
    if (!emailData.from || !emailData.to || !emailData.body) {
      return NextResponse.json(
        { error: 'Email data is incomplete' },
        { status: 400 }
      );
    }

    // Extract social media links from email body
    const links = extractSocialMediaLinks(emailData.body);
    
    if (links.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No social media links found in email',
        processed: [],
      });
    }

    // Find user by email alias
    console.log('🔍 Looking for user with email alias:', emailData.to);
    const userId = await findUserByEmailAlias(emailData.to);
    console.log('📧 Found user ID:', userId);
    
    if (!userId) {
      console.log('❌ No user found for email alias:', emailData.to);
      return NextResponse.json(
        { error: `User not found for email alias: ${emailData.to}` },
        { status: 404 }
      );
    }

    // Process each link
    const processedLinks: ProcessedLink[] = [];
    
    for (const url of links) {
      const platform = getPlatformFromUrl(url);
      
      try {
        // Extract content using our existing API
        const extractResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/social-media/extract-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ urls: [url] }),
        });
        
        const extractData = await extractResponse.json();
        
        if (extractData.success && extractData.extracted.length > 0) {
          processedLinks.push({
            url,
            platform,
            extracted: true,
            content: extractData.extracted[0],
          });
        } else {
          processedLinks.push({
            url,
            platform,
            extracted: false,
          });
        }
      } catch (error) {
        console.error(`Error processing link ${url}:`, error);
        processedLinks.push({
          url,
          platform,
          extracted: false,
        });
      }
    }

    // Get or create default collection
    const collectionId = await getOrCreateDefaultCollection(userId);

    // Add successfully extracted content to collection
    const itemsToAdd = processedLinks
      .filter(link => link.extracted && link.content)
      .map(link => link.content);

    if (itemsToAdd.length > 0) {
      // Add items to collection using our existing API
      const addResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/collections/${collectionId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: itemsToAdd,
          userId,
        }),
      });
      
      const addData = await addResponse.json();
      
      if (!addData.success) {
        throw new Error('Failed to add items to collection');
      }
    }

    // Store email processing record
    const emailRecordsRef = collection(db, 'email_records');
    await addDoc(emailRecordsRef, {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      userId,
      linksFound: links.length,
      linksProcessed: processedLinks.filter(l => l.extracted).length,
      collectionId,
      processedAt: Timestamp.now(),
      links: processedLinks,
    });

    return NextResponse.json({
      success: true,
      message: `Processed ${processedLinks.filter(l => l.extracted).length} of ${links.length} links`,
      processed: processedLinks,
      collectionId,
    });

  } catch (error) {
    console.error('Error processing email links:', error);
    return NextResponse.json(
      { error: 'Failed to process email links' },
      { status: 500 }
    );
  }
}

// GET - Retrieve email processing history for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const emailRecordsRef = collection(db, 'email_records');
    const q = query(
      emailRecordsRef,
      where('userId', '==', userId),
      limit(50)
    );
    const querySnapshot = await getDocs(q);

    const history = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      processedAt: doc.data().processedAt.toDate().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      history,
    });

  } catch (error) {
    console.error('Error retrieving email history:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve email history' },
      { status: 500 }
    );
  }
}