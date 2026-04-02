import React, { useState, useMemo, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Info, BarChart2, RefreshCw, WifiOff, ChevronRight, PlusCircle, ArrowLeft, Trash2, Edit3, Check, X, Keyboard } from 'lucide-react';
import { useLocalStorage } from 'react-use';
import { Link, useNavigate } from 'react-router-dom';

import { WordCard } from './components/WordCard';
import { SearchBar } from './components/SearchBar';
import { BottomNav } from './components/BottomNav';
import { AddWordForm } from './components/AddWordForm';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { useDictionary } from './hooks/useDictionary';
import { TAI_PHAKE_LAYOUT } from './constants/keyboards';
import { cn } from './lib/utils';
import { Word } from './types';

function Home() {
  const { words, loading, error, isOffline, fetchWords } = useDictionary();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWords = useMemo(() => {
    if (!searchQuery) return words;
    const query = searchQuery.toLowerCase();
    return words.filter(
      (w) =>
        w.taiWord.toLowerCase().includes(query) ||
        w.pronunciation.toLowerCase().includes(query) ||
        w.englishMeaning.toLowerCase().includes(query) ||
        w.assameseMeaning.toLowerCase().includes(query)
    );
  }, [words, searchQuery]);

  return (
    <div className="pb-24">
      <header className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            TD
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900">
            Tai <span className="text-indigo-600">Dictionary</span>
          </h1>
        </div>
        <p className="text-sm text-zinc-500 font-medium ml-1">Explore the beauty of Tai language</p>
      </header>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery} 
        onClear={() => setSearchQuery('')} 
      />

      <div className="px-4 py-4">
        {isOffline && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-700 text-sm font-medium">
            <WifiOff className="w-4 h-4" />
            Offline Mode: Using cached data
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            {searchQuery ? `Found ${filteredWords.length} words` : 'All Words'}
          </h2>
          <button 
            onClick={fetchWords}
            disabled={loading}
            className="p-2 text-zinc-400 hover:text-indigo-500 transition-colors disabled:animate-spin"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading && words.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-zinc-400 font-medium">Fetching dictionary...</p>
          </div>
        ) : filteredWords.length > 0 ? (
          <div className="space-y-1">
            {filteredWords.map((word) => (
              <WordCard 
                key={word.id} 
                word={word} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No words found</h3>
            <p className="text-zinc-500">Try searching for something else or check your connection.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">Settings</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 px-1">Dictionary</h2>
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
            <Link 
              to="/add"
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-zinc-700">Add New Word</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-300" />
            </Link>
            <Link 
              to="/manage"
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Edit3 className="w-5 h-5" />
                </div>
                <span className="font-bold text-zinc-700">Manage Words</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-300" />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 px-1">About</h2>
          <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                TD
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">Tai Dictionary</h3>
                <p className="text-sm text-zinc-500">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed mb-6">
              A modern, mobile-friendly dictionary designed to preserve and promote the Tai language. 
              Search across Tai, English, and Assamese meanings with ease.
            </p>
            <div className="space-y-4 border-t border-zinc-50 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center">
                  <Info className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Creator</p>
                  <p className="text-sm font-bold text-zinc-700">Tai Language Community</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Status() {
  const { stats } = useDictionary();
  const navigate = useNavigate();

  return (
    <div className="px-4 py-8 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
          <BarChart2 className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Status</h1>
          <p className="text-sm text-zinc-500">Dictionary activity & stats</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Added</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.addedCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Deleted</p>
          <p className="text-3xl font-bold text-red-500">{stats.deletedCount}</p>
        </div>
      </div>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 px-1">Recent Activity</h2>
        <div className="space-y-3">
          {stats.history.length > 0 ? (
            stats.history.slice(0, 20).map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    item.action === 'added' ? "bg-green-50 text-green-600" : 
                    item.action === 'deleted' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {item.action === 'added' ? <PlusCircle className="w-4 h-4" /> : 
                     item.action === 'deleted' ? <Trash2 className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-700">
                      {item.action === 'added' ? 'Added' : item.action === 'deleted' ? 'Deleted' : 'Edited'} "{item.word}"
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <p className="text-sm text-zinc-400">No activity recorded yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ManageWords() {
  const { words, deleteWord, updateWord } = useDictionary();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Word>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const editTaiInputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = (word: Word) => {
    setEditingId(word.id);
    setEditData(word);
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      setIsSaving(true);
      try {
        await updateWord(editingId, editData);
        setEditingId(null);
        setShowKeyboard(false);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleKeyboardInput = (char: string) => {
    setEditData(prev => ({ ...prev, taiWord: (prev.taiWord || '') + char }));
    editTaiInputRef.current?.focus();
  };

  const handleKeyboardDelete = () => {
    setEditData(prev => ({ ...prev, taiWord: (prev.taiWord || '').slice(0, -1) }));
    editTaiInputRef.current?.focus();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteWord(deletingId);
      setDeletingId(null);
    }
  };

  const filteredWords = useMemo(() => {
    if (!searchQuery) return words;
    const query = searchQuery.toLowerCase();
    return words.filter(
      (w) =>
        w.taiWord.toLowerCase().includes(query) ||
        w.pronunciation.toLowerCase().includes(query) ||
        w.englishMeaning.toLowerCase().includes(query) ||
        w.assameseMeaning.toLowerCase().includes(query)
    );
  }, [words, searchQuery]);

  return (
    <div className="px-4 py-8 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-indigo-500 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
          <Edit3 className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Manage Words</h1>
          <p className="text-sm text-zinc-500">Edit or delete entries</p>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          onClear={() => setSearchQuery('')} 
        />
      </div>

      <div className="space-y-4">
        {filteredWords.length > 0 ? (
          filteredWords.map((word) => (
            <div key={word.id} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
              {editingId === word.id ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Tai Word</label>
                      <button
                        type="button"
                        onClick={() => setShowKeyboard(!showKeyboard)}
                        className={cn(
                          "p-1 rounded-md transition-colors flex items-center gap-1 text-[8px] font-bold uppercase",
                          showKeyboard ? "bg-indigo-100 text-indigo-600" : "bg-zinc-100 text-zinc-500"
                        )}
                      >
                        <Keyboard className="w-3 h-3" />
                        Keyboard
                      </button>
                    </div>
                    <input 
                      ref={editTaiInputRef}
                      className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold"
                      value={editData.taiWord}
                      onChange={(e) => setEditData({ ...editData, taiWord: e.target.value })}
                      onFocus={() => setShowKeyboard(true)}
                      placeholder="Tai Word"
                    />
                  </div>
                  <input 
                    className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm"
                    value={editData.pronunciation}
                    onChange={(e) => setEditData({ ...editData, pronunciation: e.target.value })}
                    placeholder="Pronunciation"
                  />
                  <input 
                    className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm"
                    value={editData.englishMeaning}
                    onChange={(e) => setEditData({ ...editData, englishMeaning: e.target.value })}
                    placeholder="English Meaning"
                  />
                  <input 
                    className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm"
                    value={editData.assameseMeaning}
                    onChange={(e) => setEditData({ ...editData, assameseMeaning: e.target.value })}
                    placeholder="Assamese Meaning"
                  />
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:bg-indigo-400"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <><Check className="w-4 h-4" /> Save</>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingId(null);
                          setShowKeyboard(false);
                        }}
                        disabled={isSaving}
                        className="flex-1 bg-zinc-100 text-zinc-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">{word.taiWord}</h3>
                    <p className="text-xs text-zinc-400 italic mb-2">{word.pronunciation}</p>
                    <p className="text-sm text-zinc-600"><span className="font-bold text-zinc-400 uppercase text-[10px] mr-1">EN:</span> {word.englishMeaning}</p>
                    <p className="text-sm text-zinc-600"><span className="font-bold text-zinc-400 uppercase text-[10px] mr-1">AS:</span> {word.assameseMeaning}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStartEdit(word)}
                      className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(word.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <p className="text-sm text-zinc-400">No words match your search</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deletingId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl"
            >
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Delete Word?</h3>
              <p className="text-zinc-500 text-sm mb-6">This action cannot be undone. Are you sure you want to delete this word?</p>
              <div className="flex gap-3">
                <button 
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 bg-zinc-100 text-zinc-600 py-3 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VirtualKeyboard 
        isVisible={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInput={handleKeyboardInput}
        onDelete={handleKeyboardDelete}
        layout={TAI_PHAKE_LAYOUT}
        title="Tai Phake Keyboard"
      />
    </div>
  );
}

function Add() {
  const navigate = useNavigate();
  return (
    <div className="px-4 py-8 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-indigo-500 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Contribute</h1>
        <p className="text-sm text-zinc-500">Add new words to the dictionary</p>
      </div>
      <AddWordForm />
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-300">
        <main className="max-w-md mx-auto min-h-screen relative">
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/status" element={<PageTransition><Status /></PageTransition>} />
            <Route path="/add" element={<PageTransition><Add /></PageTransition>} />
            <Route path="/manage" element={<PageTransition><ManageWords /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
          </Routes>
          <BottomNav />
        </main>
      </div>
    </Router>
  );
}
