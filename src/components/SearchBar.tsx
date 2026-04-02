import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search Tai, English, or Assamese..."
          className="block w-full pl-10 pr-10 py-3 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-indigo-500 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
          </button>
        )}
      </div>
    </div>
  );
}
