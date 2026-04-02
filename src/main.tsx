import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { DictionaryProvider } from './context/DictionaryContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DictionaryProvider>
      <App />
    </DictionaryProvider>
  </StrictMode>,
);
