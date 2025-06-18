"use client";

import { useState, useEffect, useCallback } from 'react';

import { Collection, CollectionItem } from '@/app/api/collections/route';
import { useAuth } from '@/contexts/auth-context';

export function useCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's collections
  const fetchCollections = useCallback(async () => {
    if (!user) {
      setCollections([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/collections?userId=${user.uid}`);
      const data = await response.json();

      if (data.success) {
        setCollections(data.collections);
      } else {
        setError(data.error || 'Failed to fetch collections');
      }
    } catch (err) {
      setError('Failed to fetch collections');
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new collection
  const createCollection = async (
    name: string, 
    description?: string, 
    color?: string
  ): Promise<Collection> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        color,
        userId: user.uid,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create collection');
    }

    // Refresh collections
    await fetchCollections();
    return data.collection;
  };

  // Add items to a collection
  const addItemsToCollection = async (
    collectionId: string, 
    items: Omit<CollectionItem, 'id' | 'addedAt'>[]
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`/api/collections/${collectionId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        userId: user.uid,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to add items to collection');
    }

    // Refresh collections
    await fetchCollections();
  };

  // Remove item from collection
  const removeItemFromCollection = async (
    collectionId: string, 
    itemId: string
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`/api/collections/${collectionId}/items`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        userId: user.uid,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to remove item from collection');
    }

    // Refresh collections
    await fetchCollections();
  };

  // Extract social media content
  const extractSocialMediaContent = async (urls: string[]): Promise<CollectionItem[]> => {
    const response = await fetch('/api/social-media/extract-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to extract social media content');
    }

    return data.extractedContent;
  };

  // Process email links
  const processEmailLinks = async (emailData: {
    from: string;
    to: string;
    subject: string;
    body: string;
    userId: string;
  }) => {
    const response = await fetch('/api/email/process-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to process email links');
    }

    // Refresh collections after processing
    await fetchCollections();
    return data;
  };

  // Get email processing history
  const getEmailHistory = async (userId: string) => {
    const response = await fetch(`/api/email/history?userId=${userId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get email history');
    }

    return data.history;
  };

  // Find or create "Email Inbox" collection
  const getOrCreateEmailInboxCollection = async (): Promise<Collection> => {
    if (!user) throw new Error('User not authenticated');

    // Look for existing Email Inbox collection
    const emailInboxCollection = collections.find(
      (collection) => collection.name === 'Email Inbox'
    );

    if (emailInboxCollection) {
      return emailInboxCollection;
    }

    // Create new Email Inbox collection
    return await createCollection(
      'Email Inbox',
      'Social media links automatically added from emails',
      'bg-blue-100'
    );
  };

  // Delete a collection
  const deleteCollection = async (collectionId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`/api/collections/${collectionId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete collection');
    }

    // Refresh collections
    await fetchCollections();
  };

  // Update a collection
  const updateCollection = async (
    collectionId: string,
    updates: Partial<Pick<Collection, 'name' | 'description' | 'color'>>
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`/api/collections/${collectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updates,
        userId: user.uid,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to update collection');
    }

    // Refresh collections
    await fetchCollections();
  };

  // Load collections when user changes
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return {
    collections,
    loading,
    error,
    fetchCollections,
    createCollection,
    addItemsToCollection,
    removeItemFromCollection,
    extractSocialMediaContent,
    processEmailLinks,
    getEmailHistory,
    getOrCreateEmailInboxCollection,
    deleteCollection,
    updateCollection,
  };
} 