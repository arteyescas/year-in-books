import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_BOOKS = [
  { id: 1, title: 'THE LOVE LIE', author: 'MCCALLAN', color: 'bg-[#1e1f26]', text: 'text-gray-300', rating: 3, height: 280, width: 30, starsColor: 'text-pink-600', coverUrl: './covers/The_Love_Lie.jpeg' },
  { id: 2, title: 'BEATRIZ Y LOS CUERPOS CELESTES', author: 'ETXEBARRIA', color: 'bg-[#f8b15d]', text: 'text-gray-900', rating: 2, height: 190, width: 32, starsColor: 'text-gray-800', coverUrl: './covers/Beatriz_y_los_cuerpos_celestes.jpeg' },
  { id: 3, title: 'RELATOS LUMBUNG', author: 'BROWN', color: 'bg-[#f4cc5c]', text: 'text-gray-800', rating: 3, height: 220, width: 36, starsColor: 'text-gray-800', coverUrl: './covers/Relatos_Lumbung.jpeg' },
  { id: 4, title: 'ARDE JOSEFINA', author: 'REYES RETANA', color: 'bg-[#31565a]', text: 'text-white', rating: 3, height: 230, width: 38, starsColor: 'text-orange-400', coverUrl: './covers/Arde_Josefina.jpeg' },
  { id: 5, title: 'NO DEJAR QUE SE APAGUE EL FUEGO', author: 'TOEWS', color: 'bg-[#379a78]', text: 'text-white', rating: 3, height: 230, width: 34, starsColor: 'text-gray-900', coverUrl: './covers/Fight_Night.jpeg', label: 'La Tregua' },
  { id: 6, title: 'EL PENSAMIENTO ERÓTICO', author: 'TORRES', color: 'bg-[#e76d5f]', text: 'text-white', rating: 3, height: 160, width: 40, starsColor: 'text-white', coverUrl: './covers/Pensamiento_Erotico.jpeg' },
  { id: 7, title: 'LA CABEZA DE MI PADRE', author: 'MURILLO', color: 'bg-[#6c7a36]', text: 'text-white', rating: 4, height: 160, width: 28, starsColor: 'text-yellow-400', coverUrl: './covers/Cabeza_de_mi_Padre.jpeg' },
  { id: 8, title: 'ORBITAL', author: 'HARVEY', color: 'bg-[#314a2a]', text: 'text-white', rating: 3, height: 250, width: 30, starsColor: 'text-yellow-400', coverUrl: './covers/Orbital.jpeg', label: 'La Tregua' },
  { id: 9, title: 'PERSEPOLIS', author: 'SATRAPI', color: 'bg-[#1e1f26], text: 'text-blue-300', rating: 3, height: 250, width: 30, starsColor: 'text-blue-400', coverUrl: './covers/PERSEPOLIS.jpeg' }
];

// --- GOOGLE SHEETS CONFIG ---
// Replace this URL with your Published CSV link!
const SHEET_CSV_URL = 'YOUR_PUBLISHED_CSV_URL_HERE';

// Tooltip String Helpers
const toTitleCase = (str) => {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const renderStars = (rating) => {
  const safeRating = Math.max(0, Math.min(5, rating || 0));
  return '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating);
};

// --- AUDIO UTILS ---
let audioCtx = null;

const MURAKAMI_TUNE = [
  329.63, // E4
  293.66, // D4
  329.63, // E4
  293.66, // D4
  329.63, // E4
  246.94, // B3
  293.66, // D4
  261.63, // C4
  220.00  // A3
];

const playHoverNote = (index) => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const freq = MURAKAMI_TUNE[index % MURAKAMI_TUNE.length];

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = freq;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  oscillator.start(now);
  oscillator.stop(now + 1.5);
};

// --- GOOGLE SHEETS PARSER ---
const parseGoogleSheetCSV = (csvText) => {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
  const titleIdx = headers.findIndex(h => h === 'title');
  const authorIdx = headers.findIndex(h => h === 'author');
  const ratingIdx = headers.findIndex(h => h === 'rating');
  const pagesIdx = headers.findIndex(h => h === 'pages');
  const coverIdx = headers.findIndex(h => h === 'cover url' || h === 'cover');
  const labelIdx = headers.findIndex(h => h === 'label');

  if (titleIdx === -1) return [];

  const parsedBooks = [];
  let idCounter = 1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const row = [];
    let current = '';
    let inQuotes = false;
    for (let char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) { row.push(current); current = ''; }
      else current += char;
    }
    row.push(current);

    if (row.length > titleIdx && row[titleIdx]) {
      const title = row[titleIdx].replace(/"/g, '').trim();
      if (!title) continue;
      
      const author = authorIdx !== -1 && row[authorIdx] ? row[authorIdx].replace(/"/g, '').trim().toUpperCase() : 'UNKNOWN';
      const rating = ratingIdx !== -1 ? parseInt(row[ratingIdx]) : 0;
      const pages = pagesIdx !== -1 ? parseInt(row[pagesIdx]) : 300;
      const coverUrl = coverIdx !== -1 && row[coverIdx] ? row[coverIdx].replace(/"/g, '').trim() : '';
      const label = labelIdx !== -1 && row[labelIdx] ? row[labelIdx].replace(/"/g, '').trim() : '';

      const style = getDeterminantColor(title);
      const height = Math.min(Math.max((pages / 2) + 100, 160), 320);
      const width = Math.min(Math.max((pages / 10) + 20, 24), 50);

      parsedBooks.push({
        id: idCounter++,
        title: title.toUpperCase(),
        author,
        color: style.bg,
        text: style.text,
        starsColor: style.star,
        rating: isNaN(rating) ? 0 : rating,
        height,
        width,
        coverUrl,
        label
      });
    }
  }
  return parsedBooks;
};

const getDeterminantColor = (str) => {
  const PALETTE = [
    { bg: 'bg-[#e76d5f]', text: 'text-white', star: 'text-white' },
    { bg: 'bg-[#379a78]', text: 'text-white', star: 'text-yellow-300' },
    { bg: 'bg-[#f4cc5c]', text: 'text-gray-900', star: 'text-gray-900' },
    { bg: 'bg-[#31565a]', text: 'text-white', star: 'text-orange-400' },
    { bg: 'bg-[#1e1f26]', text: 'text-gray-300', star: 'text-pink-600' },
    { bg: 'bg-[#8944ab]', text: 'text-white', star: 'text-yellow-300' },
    { bg: 'bg-[#3ba6d8]', text: 'text-white', star: 'text-white' },
    { bg: 'bg-[#e90e63]', text: 'text-white', star: 'text-yellow-300' },
    { bg: 'bg-[#d6a25e]', text: 'text-gray-900', star: 'text-gray-900' },
    { bg: 'bg-[#1baab1]', text: 'text-white', star: 'text-yellow-200' },
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

// --- COMPONENTS ---

const AnimatedCloud = ({ top, durationClass, delay, scale = 1, opacity = 1 }) => {
  return (
    <div
      className={`absolute pointer-events-none ${durationClass}`}
      style={{
        top,
        left: '100%',
        transform: `scale(${scale})`,
        opacity,
        animationDelay: delay,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-4 dither-bg opacity-80"></div>
        <div className="w-24 h-4 bg-white/95"></div>
        <div className="w-32 h-4 bg-white relative">
           <div className="absolute right-0 bottom-0 w-12 h-full dither-bg opacity-60"></div>
        </div>
        <div className="w-20 h-4 dither-bg opacity-90 -mt-[1px]"></div>
      </div>
    </div>
  );
};


const Book = ({ book, index, soundEnabled, setTooltip, onClick }) => {
  let maxTitleFsByWidth = book.width - 10; 
  let titleFontSize = Math.max(8, Math.min(13, maxTitleFsByWidth));

  let maxAuthorFsByWidth = book.width - 14;
  let authorFontSize = Math.max(7, Math.min(10, maxAuthorFsByWidth));

  const titleHeightEst = book.title.length * titleFontSize * 0.85;
  const authorHeightEst = book.author.length * authorFontSize * 0.85;
  
  const stickerSize = Math.min(book.width - 4, 28);
  const stickerSpace = book.label === 'La Tregua' ? stickerSize + 16 : 0;
  
  const minTextHeight = titleHeightEst + authorHeightEst + 90 + stickerSpace;
  
  let finalHeight = Math.max(book.height, minTextHeight);

  if (finalHeight > 400) {
    const scale = 400 / minTextHeight;
    titleFontSize = Math.max(6, titleFontSize * scale);
    authorFontSize = Math.max(5, authorFontSize * scale);
    finalHeight = 400;
  }

  return (
    <div 
      onClick={() => onClick && onClick(book)}
      onMouseEnter={(e) => {
        if (soundEnabled) playHoverNote(index);
        setTooltip({
          show: true,
          x: e.clientX,
          y: e.clientY,
          title: book.title,
          author: book.author,
          rating: book.rating
        });
      }}
      onMouseMove={(e) => {
        setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
      }}
      onMouseLeave={() => {
        setTooltip(prev => ({ ...prev, show: false }));
      }}
      className={`relative flex flex-col items-center justify-between rounded-t-sm shadow-[-3px_0_8px_rgba(0,0,0,0.15)] border-l border-white/10 transition-transform duration-300 hover:-translate-y-4 hover:z-20 cursor-pointer overflow-hidden ${book.color} ${book.text}`}
      style={{ height: `${finalHeight}px`, width: `${book.width}px`, flexShrink: 0, marginRight: '1px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10 pointer-events-none rounded-t-sm"></div>

      <div className={`flex flex-col mt-4 gap-[1px] shrink-0 z-10 ${book.starsColor}`}>
        {Array.from({ length: book.rating || 0 }).map((_, i) => (
          <span key={i} className="text-[6px] leading-none">★</span>
        ))}
      </div>

      <div 
        className="flex-1 w-full flex justify-between items-center py-4 z-10"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span 
          className="font-bold whitespace-nowrap leading-none tracking-wide"
          style={{ fontSize: `${titleFontSize}px` }}
        >
          {book.title}
        </span>

        {book.label === 'La Tregua' && (
          <div 
            className="z-20 drop-shadow-md rounded-full overflow-hidden shrink-0 my-2"
            style={{ 
              width: `${stickerSize}px`,
              height: `${stickerSize}px`,
              transform: 'rotate(-4deg)',
            }}
          >
            <img 
              src="./la-tregua-sticker.png" 
              alt="La Tregua Label" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <span 
          className="font-medium tracking-widest opacity-80 whitespace-nowrap leading-none"
          style={{ fontSize: `${authorFontSize}px` }}
        >
          {book.author}
        </span>
      </div>
    </div>
  );
};


// --- MAIN APP ---
export default function App() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showStickerModal, setShowStickerModal] = useState(false); // New state for sticker modal
  
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, title: '', author: '', rating: 0 });

  useEffect(() => {
    const fetchBooks = async () => {
      if (SHEET_CSV_URL === 'YOUR_PUBLISHED_CSV_URL_HERE') return; 
      
      try {
        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const csvText = await response.text();
        const parsedBooks = parseGoogleSheetCSV(csvText);
        
        if (parsedBooks.length > 0) {
          setBooks(parsedBooks);
        }
      } catch (err) {
        console.error("Failed to fetch books from Google Sheets:", err);
      }
    };

    fetchBooks();
  }, []);

  const handleToggleSound = () => {
    if (!soundEnabled) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.01);
    }
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="min-h-screen bg-[#386AF5] relative overflow-hidden font-sans selection:bg-white/30 flex flex-col">
      
      {/* Custom Hover Tooltip */}
      {tooltip.show && (
        <div 
          className="fixed z-[100] pointer-events-none px-3 py-1.5 bg-[#3a2629]/95 backdrop-blur-sm text-white text-xs font-sans rounded shadow-xl border border-white/10 whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -180%)', 
          }}
        >
          {toTitleCase(tooltip.title)} by {toTitleCase(tooltip.author)} 
          <span className="opacity-60 mx-1.5">—</span> 
          {renderStars(tooltip.rating)}
        </div>
      )}

      {/* Navbar / Tools */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-50">
        <div className="text-white/50 text-xs font-medium tracking-wider mt-2 hidden sm:block drop-shadow-sm">
          BOOKSHELF VISUALIZER
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button 
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all flex items-center gap-2 border shadow-sm ${
              soundEnabled ? 'bg-white/20 text-white border-white/20' : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </div>
      </div>

      {/* Animated Background Clouds Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <AnimatedCloud top="15%" durationClass="cloud-layer-1" delay="-10s" scale={1} opacity={0.9} />
        <AnimatedCloud top="25%" durationClass="cloud-layer-2" delay="-40s" scale={0.7} opacity={0.6} />
        <AnimatedCloud top="45%" durationClass="cloud-layer-3" delay="-70s" scale={0.8} opacity={0.7} />
        <AnimatedCloud top="60%" durationClass="cloud-layer-1" delay="-25s" scale={1.2} opacity={0.85} />
        <AnimatedCloud top="20%" durationClass="cloud-layer-4" delay="-5s" scale={1.1} opacity={0.95} />
        <AnimatedCloud top="75%" durationClass="cloud-layer-2" delay="-55s" scale={0.6} opacity={0.5} />
        <AnimatedCloud top="10%" durationClass="cloud-layer-3" delay="-90s" scale={0.9} opacity={0.8} />
      </div>

      {/* Scene Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative mt-16 lg:mt-0 z-10">

        {/* Header */}
        <div className="text-center z-10 mb-16 relative">
          <h2 className="text-white/80 text-sm tracking-[0.3em] font-medium uppercase mb-3 drop-shadow-sm">
            A Year In
          </h2>
          <h1 className="text-white text-5xl md:text-7xl font-serif tracking-wide drop-shadow-md" style={{ fontFamily: 'Georgia, serif'}}>
            BOOKS OF 2026
          </h1>
        </div>

        {/* Shelf Area */}
        <div className="relative w-full max-w-[95%] overflow-x-auto pb-8 pt-12 custom-scrollbar">
          <div className="min-w-max mx-auto px-12 md:px-24 flex flex-col items-center">
            
            {/* Books Container */}
            <div className="flex items-end justify-center relative z-10 px-4">
              {books.map((book, index) => (
                <Book key={book.id} book={book} index={index} soundEnabled={soundEnabled} setTooltip={setTooltip} onClick={setSelectedBook} />
              ))}
            </div>

            {/* The Physical Shelf Line */}
            <div className="w-[105%] h-2.5 bg-[#192b5e] rounded-full shadow-lg relative z-0 -mt-[1px]">
              {/* Shelf shadow underneath */}
              <div className="absolute top-full left-4 right-4 h-4 bg-black/10 blur-sm rounded-b-full"></div>
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-2">
                {books.length} Books Read
              </p>
              
              {/* La Tregua Legend */}
              <div className="flex items-center gap-2 mt-1 mb-2">
                <img 
                  src="./la-tregua-sticker.png" 
                  alt="La Tregua Sticker" 
                  className="w-5 h-5 rounded-full drop-shadow-md cursor-pointer hover:ring-2 hover:ring-white/50 hover:scale-110 transition-all"
                  onClick={() => setShowStickerModal(true)}
                  title="View full sticker"
                />
                <span className="text-white/60 text-xs font-medium tracking-wide italic">
                  Forma parte de: "La Tregua - Polígono de Lectura"
                </span>
              </div>

              {/* Profile Links */}
              <div className="flex gap-4 mt-3">
                <a 
                  href="https://www.goodreads.com/user/show/70849724-artemisa" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm transition-all border border-white/10 flex items-center gap-2 shadow-sm"
                >
                  📚 Goodreads
                </a>
                <a 
                  href="https://pagebound.co/users/arteyescas" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm transition-all border border-white/10 flex items-center gap-2 shadow-sm"
                >
                  ✨ Pagebound
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Author Reference / Credits */}
      <div className="absolute bottom-4 left-4 z-50 text-white/50 text-[10px] sm:text-xs font-medium flex flex-col gap-1 drop-shadow-sm">
        <p>
          Original Creator: <a href="https://twitter.com/axayagrawal" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">@axayagrawal</a>
        </p>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
          <a 
            href="https://axayagrawal.com/playground" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors underline decoration-white/30 underline-offset-2"
          >
            Playground
          </a>
          <a 
            href="https://axayagrawal.notion.site/how-i-vibe-coded-my-2025-bookshelf-with-claude" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-white transition-colors underline decoration-white/30 underline-offset-2"
          >
            How it was done
          </a>
        </div>
      </div>

      {/* Book Cover Modal */}
      {selectedBook && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedBook(null)}
        >
          <div 
            className="relative max-w-sm md:max-w-md w-full flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
            
            {selectedBook.coverUrl ? (
              <img 
                src={selectedBook.coverUrl} 
                alt={`${selectedBook.title} cover`} 
                className="w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
              />
            ) : (
              <div className="w-64 h-96 bg-[#2a2b38] flex flex-col items-center justify-center rounded-md shadow-2xl border border-white/10 p-6 text-center">
                <div className="w-16 h-16 mb-4 opacity-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl text-[#2a2b38]">?</span>
                </div>
                <p className="text-white/50 text-sm">No cover image added yet for</p>
                <p className="text-white font-bold mt-2 font-serif">{selectedBook.title}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* La Tregua Sticker Modal */}
      {showStickerModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowStickerModal(false)}
        >
          <div 
            className="relative max-w-sm md:max-w-md w-full flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowStickerModal(false)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
            
            <img 
              src="./la-tregua-sticker.png" 
              alt="La Tregua Full Sticker" 
              className="w-full max-h-[80vh] object-contain rounded-full shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Global Styles for Scrollbar & Dithered Cloud Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }

        /* Continuous Drift Animation for Clouds */
        @keyframes drift {
          0% { transform: translateX(10vw); }
          100% { transform: translateX(-120vw); }
        }

        /* 8-bit Glitter Animation (using sharp steps to mimic retro pixel frames) */
        @keyframes glitter {
          0%, 49.9% { background-position: 0px 0px; opacity: 1; }
          50%, 99.9% { background-position: 4px 4px; opacity: 0.85; }
          100% { background-position: 0px 0px; opacity: 1; }
        }

        /* Pure CSS Pixel Dithering Pattern (SVG Data URI) */
        .dither-bg {
          background-color: transparent;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='white'/%3E%3Crect x='4' y='4' width='4' height='4' fill='white'/%3E%3C/svg%3E");
          background-size: 8px 8px;
          animation: glitter 1s infinite;
        }

        /* Animation Speeds for Parallax Effect */
        .cloud-layer-1 { animation: drift 60s linear infinite; }
        .cloud-layer-2 { animation: drift 85s linear infinite; }
        .cloud-layer-3 { animation: drift 120s linear infinite; }
        .cloud-layer-4 { animation: drift 45s linear infinite; }
      `}} />
    </div>
  );
}
