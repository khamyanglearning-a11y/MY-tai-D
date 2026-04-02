export interface Word {
  id: string;
  taiWord: string;
  pronunciation: string;
  englishMeaning: string;
  assameseMeaning: string;
  addedAt?: number;
}

export interface HistoryItem {
  id: string;
  word: string;
  action: 'added' | 'deleted' | 'edited';
  timestamp: number;
}

export interface DictionaryState {
  words: Word[];
  favorites: string[];
  isDarkMode: boolean;
  lastUpdated: number;
  addedCount: number;
  deletedCount: number;
  history: HistoryItem[];
}
