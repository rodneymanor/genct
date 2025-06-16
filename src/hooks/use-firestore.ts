"use client";

import { useState, useEffect } from "react";

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export interface Recording {
  id: string;
  title: string;
  transcription: string;
  audioUrl?: string;
  duration: number;
  createdAt: Timestamp;
  userId: string;
}

// Hook for managing notes
export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const notesRef = collection(db, "notes");
    const q = query(notesRef, where("userId", "==", user.uid), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[];
        setNotes(notesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching notes:", err);
        setError("Failed to fetch notes");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const addNote = async (title: string, content: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const notesRef = collection(db, "notes");
      const now = Timestamp.now();
      await addDoc(notesRef, {
        title,
        content,
        createdAt: now,
        updatedAt: now,
        userId: user.uid,
      });
    } catch (err) {
      console.error("Error adding note:", err);
      throw new Error("Failed to add note");
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, {
        title,
        content,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error("Error updating note:", err);
      throw new Error("Failed to update note");
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const noteRef = doc(db, "notes", id);
      await deleteDoc(noteRef);
    } catch (err) {
      console.error("Error deleting note:", err);
      throw new Error("Failed to delete note");
    }
  };

  const getNote = async (id: string): Promise<Note | null> => {
    if (!user) throw new Error("User not authenticated");

    try {
      const noteRef = doc(db, "notes", id);
      const noteSnap = await getDoc(noteRef);

      if (noteSnap.exists()) {
        return { id: noteSnap.id, ...noteSnap.data() } as Note;
      }
      return null;
    } catch (err) {
      console.error("Error getting note:", err);
      throw new Error("Failed to get note");
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    getNote,
  };
}

// Hook for managing recordings
export function useRecordings() {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRecordings([]);
      setLoading(false);
      return;
    }

    const recordingsRef = collection(db, "recordings");
    const q = query(recordingsRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const recordingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Recording[];
        setRecordings(recordingsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching recordings:", err);
        setError("Failed to fetch recordings");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const addRecording = async (title: string, transcription: string, duration: number, audioUrl?: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const recordingsRef = collection(db, "recordings");
      await addDoc(recordingsRef, {
        title,
        transcription,
        audioUrl,
        duration,
        createdAt: Timestamp.now(),
        userId: user.uid,
      });
    } catch (err) {
      console.error("Error adding recording:", err);
      throw new Error("Failed to add recording");
    }
  };

  const deleteRecording = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const recordingRef = doc(db, "recordings", id);
      await deleteDoc(recordingRef);
    } catch (err) {
      console.error("Error deleting recording:", err);
      throw new Error("Failed to delete recording");
    }
  };

  return {
    recordings,
    loading,
    error,
    addRecording,
    deleteRecording,
  };
}
