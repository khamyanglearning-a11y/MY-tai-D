import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Keyboard } from 'lucide-react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { useDictionary } from '../hooks/useDictionary';
import { TAI_PHAKE_LAYOUT } from '../constants/keyboards';
import { cn } from '../lib/utils';

export function AddWordForm() {
  const { addWord } = useDictionary();
  const [formData, setFormData] = useState({
    taiWord: '',
    pronunciation: '',
    englishMeaning: '',
    assameseMeaning: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const taiInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.taiWord || !formData.pronunciation || !formData.englishMeaning || !formData.assameseMeaning) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await addWord(formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({
        taiWord: '',
        pronunciation: '',
        englishMeaning: '',
        assameseMeaning: '',
      });
      setShowKeyboard(false);
    } catch (err) {
      setError('Failed to add word. Please try again.');
      console.error('Error adding word:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleKeyboardInput = (char: string) => {
    setFormData(prev => ({ ...prev, taiWord: prev.taiWord + char }));
    taiInputRef.current?.focus();
  };

  const handleKeyboardDelete = () => {
    setFormData(prev => ({ ...prev, taiWord: prev.taiWord.slice(0, -1) }));
    taiInputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100"
    >
      <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
        Add New Word
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold">
            {error}
          </div>
        )}
        <div className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Tai Word</label>
            <button
              type="button"
              onClick={() => setShowKeyboard(!showKeyboard)}
              className={cn(
                "p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase",
                showKeyboard ? "bg-indigo-100 text-indigo-600" : "bg-zinc-100 text-zinc-500"
              )}
            >
              <Keyboard className="w-3.5 h-3.5" />
              Keyboard
            </button>
          </div>
          <input
            ref={taiInputRef}
            required
            name="taiWord"
            value={formData.taiWord}
            onChange={handleChange}
            onFocus={() => setShowKeyboard(true)}
            placeholder="e.g. ၵိၼ်"
            className="w-full px-4 py-3 bg-zinc-100 border-none rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Pronunciation</label>
          <input
            required
            name="pronunciation"
            value={formData.pronunciation}
            onChange={handleChange}
            placeholder="e.g. Kin"
            className="w-full px-4 py-3 bg-zinc-100 border-none rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">English Meaning</label>
          <input
            required
            name="englishMeaning"
            value={formData.englishMeaning}
            onChange={handleChange}
            placeholder="e.g. To eat"
            className="w-full px-4 py-3 bg-zinc-100 border-none rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Assamese Meaning</label>
          <input
            required
            name="assameseMeaning"
            value={formData.assameseMeaning}
            onChange={handleChange}
            placeholder="e.g. খোৱা"
            className="w-full px-4 py-3 bg-zinc-100 border-none rounded-xl text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={submitted || loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 mt-4"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : submitted ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Submitted Successfully
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Word
            </>
          )}
        </button>
      </form>

      <VirtualKeyboard 
        isVisible={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInput={handleKeyboardInput}
        onDelete={handleKeyboardDelete}
        layout={TAI_PHAKE_LAYOUT}
        title="Tai Phake Keyboard"
      />
    </motion.div>
  );
}
