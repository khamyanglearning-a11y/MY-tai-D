# Tai Dictionary Mobile App

A modern, mobile-friendly dictionary application for the Tai language, built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Real-time Search**: Search across Tai words, pronunciation, English, and Assamese meanings.
- **Offline Support**: Automatically caches data for offline use.
- **Google Sheets Integration**: Fetches data from a Google Sheet via the `opensheet` API.
- **Favorites**: Save your most-used words for quick access.
- **Dark Mode**: Comfortable reading in any lighting.
- **Voice Pronunciation**: Text-to-speech support for Tai words.
- **Contribute**: Simple form to suggest new words.
- **Modern UI**: Clean, minimal design with smooth animations.

## 📁 Project Structure

- `src/components/`: Reusable UI components (WordCard, SearchBar, BottomNav, etc.)
- `src/hooks/`: Custom hooks for data fetching and state management.
- `src/lib/`: Utility functions.
- `src/types.ts`: TypeScript interfaces.
- `src/App.tsx`: Main application logic and routing.

## ⚙️ Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Google Sheets Integration**:
   - Create a Google Sheet with headers: `ID`, `Tai Word`, `Pronunciation`, `English Meaning`, `Assamese Meaning`.
   - Make the sheet public (File > Share > Share with others > Anyone with the link can view).
   - Get the Spreadsheet ID from the URL.
   - Update `GOOGLE_SHEET_URL` in `src/hooks/useDictionary.ts`:
     `https://opensheet.elk.sh/YOUR_SPREADSHEET_ID/YOUR_SHEET_NAME`

## 🎨 UI Components

- **WordCard**: Displays word details with actions (Copy, Share, Favorite, Speak).
- **SearchBar**: Sticky search input with real-time filtering.
- **BottomNav**: Mobile-style navigation bar.
- **AddWordForm**: Form for user contributions.

## 📱 Mobile Optimization

The app is designed with a mobile-first approach, featuring:
- Touch-friendly targets (min 44px).
- Sticky headers and bottom navigation.
- Responsive layouts for various screen sizes.
- Smooth transitions and micro-animations.
