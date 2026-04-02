import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocalStorage } from 'react-use';
import { Word, HistoryItem } from '../types';
import { supabase } from '../lib/supabase';

interface DictionaryContextType {
  words: Word[];
  favorites: string[];
  stats: {
    addedCount: number;
    deletedCount: number;
    history: HistoryItem[];
  };
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  fetchWords: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  addWord: (newWord: Omit<Word, 'id' | 'addedAt'>) => Promise<void>;
  updateWord: (id: string, updatedData: Partial<Word>) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
}

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

const CACHE_KEY = 'tai_dictionary_cache_v2';
const FAVORITES_KEY = 'tai_dictionary_favorites_v2';
const STATS_KEY = 'tai_dictionary_stats_v2';

export function DictionaryProvider({ children }: { children: ReactNode }) {
  const [words, setWords] = useLocalStorage<Word[]>(CACHE_KEY, []);
  const [favorites, setFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, []);
  const [stats, setStats] = useLocalStorage<{
    addedCount: number;
    deletedCount: number;
    history: HistoryItem[];
  }>(STATS_KEY, { addedCount: 0, deletedCount: 0, history: [] });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchWords = useCallback(async () => {
    if (!navigator.onLine) {
      setError('You are offline. Using cached data.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      if (data) {
        const formattedWords: Word[] = data.map((item: any) => ({
          id: item.id,
          taiWord: item.tai_word,
          pronunciation: item.pronunciation,
          englishMeaning: item.english_meaning,
          assameseMeaning: item.assamese_meaning,
          addedAt: new Date(item.created_at).getTime()
        }));
        setWords(formattedWords);
      }
    } catch (err) {
      setError('Failed to sync with Supabase. Using cached data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setWords]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const addWord = async (newWord: Omit<Word, 'id' | 'addedAt'>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('words')
        .insert([{
          tai_word: newWord.taiWord,
          pronunciation: newWord.pronunciation,
          english_meaning: newWord.englishMeaning,
          assamese_meaning: newWord.assameseMeaning
        }])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      if (data) {
        const wordWithId: Word = {
          ...newWord,
          id: data.id,
          addedAt: new Date(data.created_at).getTime()
        };
        setWords(prev => [wordWithId, ...(prev || [])]);
        setStats(prev => ({
          ...prev!,
          addedCount: (prev?.addedCount || 0) + 1,
          history: [{
            id: wordWithId.id,
            word: wordWithId.taiWord,
            action: 'added',
            timestamp: Date.now()
          }, ...(prev?.history || [])]
        }));
      }
    } catch (err) {
      console.error('Failed to add word to Supabase:', err);
      throw err;
    }
  };

  const updateWord = async (id: string, updatedData: Partial<Word>) => {
    try {
      const { error: supabaseError } = await supabase
        .from('words')
        .update({
          tai_word: updatedData.taiWord,
          pronunciation: updatedData.pronunciation,
          english_meaning: updatedData.englishMeaning,
          assamese_meaning: updatedData.assameseMeaning
        })
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      setWords(prev => prev?.map(w => w.id === id ? { ...w, ...updatedData } : w));
      const word = words?.find(w => w.id === id);
      if (word) {
        setStats(prev => ({
          ...prev!,
          history: [{
            id: Date.now().toString(),
            word: word.taiWord,
            action: 'edited',
            timestamp: Date.now()
          }, ...(prev?.history || [])]
        }));
      }
    } catch (err) {
      console.error('Failed to update word in Supabase:', err);
      throw err;
    }
  };

  const deleteWord = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('words')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      const word = words?.find(w => w.id === id);
      setWords(prev => prev?.filter(w => w.id !== id));
      setFavorites(prev => prev?.filter(fid => fid !== id));
      if (word) {
        setStats(prev => ({
          ...prev!,
          deletedCount: (prev?.deletedCount || 0) + 1,
          history: [{
            id: Date.now().toString(),
            word: word.taiWord,
            action: 'deleted',
            timestamp: Date.now()
          }, ...(prev?.history || [])]
        }));
      }
    } catch (err) {
      console.error('Failed to delete word from Supabase:', err);
      throw err;
    }
  };

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const current = prev || [];
      return current.includes(id) 
        ? current.filter(f => f !== id) 
        : [...current, id];
    });
  }, [setFavorites]);

  return (
    <DictionaryContext.Provider value={{
      words: words || [],
      favorites: favorites || [],
      stats: stats!,
      loading,
      error,
      isOffline,
      fetchWords,
      toggleFavorite,
      addWord,
      updateWord,
      deleteWord
    }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === undefined) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}
