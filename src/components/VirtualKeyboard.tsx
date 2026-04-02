import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Delete, ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';

interface VirtualKeyboardProps {
  onInput: (char: string) => void;
  onDelete: () => void;
  onClose: () => void;
  isVisible: boolean;
  layout: string[][] | { primary: string[][]; shift: string[][] };
  title: string;
}

export function VirtualKeyboard({ onInput, onDelete, onClose, isVisible, layout, title }: VirtualKeyboardProps) {
  const [isShifted, setIsShifted] = useState(false);

  useEffect(() => {
    setIsShifted(false);
  }, [layout, isVisible]);

  const currentLayout = Array.isArray(layout) 
    ? layout 
    : (isShifted ? layout.shift : layout.primary);

  const hasShift = !Array.isArray(layout);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 300, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-zinc-200/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-300 dark:border-zinc-800 shadow-2xl z-[100] p-1.5 pb-6 max-w-md mx-auto rounded-t-2xl"
        >
          <div className="flex justify-between items-center mb-2 px-3">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{title}</span>
            <button 
              onClick={onClose}
              className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {currentLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1 px-0.5">
                {row.map((char) => (
                  <button
                    key={char}
                    onClick={() => onInput(char)}
                    className="flex-1 h-10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-md text-lg font-medium text-zinc-900 dark:text-zinc-100 shadow-sm transition-all active:scale-95 flex items-center justify-center min-w-[28px]"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}

            {/* Bottom Control Row */}
            <div className="flex justify-center gap-1 px-0.5 mt-1">
              {hasShift && (
                <button
                  onClick={() => setIsShifted(!isShifted)}
                  className={cn(
                    "w-12 h-10 rounded-md transition-all active:scale-95 flex items-center justify-center border shadow-sm",
                    isShifted 
                      ? "bg-indigo-600 text-white border-indigo-700 dark:border-indigo-500" 
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
                  )}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={() => onInput(' ')}
                className="flex-[3] h-10 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-md text-sm font-bold text-zinc-500 dark:text-zinc-400 shadow-sm transition-all active:scale-95 flex items-center justify-center"
              >
                SPACE
              </button>

              <button
                onClick={onDelete}
                className="w-12 h-10 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600 border border-zinc-400 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 transition-all active:scale-95 flex items-center justify-center shadow-sm"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
