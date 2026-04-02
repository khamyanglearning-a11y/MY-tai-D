import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Word } from '../types';
import { cn } from '../lib/utils';

interface WordCardProps {
  word: Word;
  key?: string | number;
}

export function WordCard({ word }: WordCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 mb-4"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-3xl font-bold text-zinc-900 mb-1">
            {word.taiWord}
          </h3>
          <p className="text-sm font-medium text-zinc-500 italic">
            {word.pronunciation}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">English</span>
          <p className="text-zinc-700 font-medium">{word.englishMeaning}</p>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Assamese</span>
          <p className="text-zinc-700 font-medium">{word.assameseMeaning}</p>
        </div>
      </div>
    </motion.div>
  );
}
