import React, { useState, useRef } from 'react';
import { Upload, X, Info, Plus, Volume2, VolumeX } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_BOOKS = [
  { id: 1, title: 'THE CREATIVE ACT', author: 'RUBIN', color: 'bg-[#1e1f26]', text: 'text-gray-300', rating: 4, height: 280, width: 44, starsColor: 'text-pink-600' },
  { id: 2, title: 'NO MORE MR. NICE GUY', author: 'GLOVER', color: 'bg-[#f8b15d]', text: 'text-gray-900', rating: 4, height: 190, width: 32, starsColor: 'text-gray-800' },
  { id: 3, title: 'YELLOWFACE', author: 'KUANG', color: 'bg-[#f4cc5c]', text: 'text-gray-800', rating: 4, height: 220, width: 36, starsColor: 'text-gray-800' },
  { id: 4, title: 'THE SILENT PATIENT', author: 'MICHAELIDES', color: 'bg-[#31565a]', text: 'text-white', rating: 3, height: 230, width: 38, starsColor: 'text-orange-400' },
  { id: 5, title: "ALICE'S ADVENTURES IN WONDERLAND", author: 'CARROLL', color: 'bg-[#379a78]', text: 'text-white', rating: 3, height: 230, width: 34, starsColor: 'text-gray-900' },
  { id: 6, title: 'THE GENTLEMAN FROM PERU', author: 'ACIMAN', color: 'bg-[#e76d5f]', text: 'text-white', rating: 4, height: 160, width: 28, starsColor: 'text-white' },
  { id: 7, title: 'THE BOOK OF CLARITY', author: 'CHOPRA', color: 'bg-[#6c7a36]', text: 'text-white', rating: 4, height: 160, width: 28, starsColor: 'text-yellow-400' },
  { id: 8, title: 'BEFORE THE COFFEE GETS COLD', author: 'KAWAGUCHI', color: 'bg-[#314a2a]', text: 'text-white', rating: 4, height: 180, width: 30, starsColor: 'text-yellow-400' },
  { id: 9, title: 'THE HARD THING ABOUT HARD THINGS', author: 'HOROWITZ', color: 'bg-[#d6a25e]', text: 'text-gray-900', rating: 4, height: 240, width: 36, starsColor: 'text-gray-900' },
  { id: 10, title: 'GHACHAR GHOCHAR', author: 'SHANBHAG', color: 'bg-[#ece5cd]', text: 'text-gray-900', rating: 3, height: 190, width: 30, starsColor: 'text-gray-500' },
  { id: 11, title: 'TINY EXPERIMENTS', author: 'CUFF', color: 'bg-[#153431]', text: 'text-yellow-500', rating: 4, height: 260, width: 38, starsColor: 'text-yellow-500' },
  { id: 12, title: 'PIRANESI', author: 'CLARKE', color: 'bg-[#db3e29]', text: 'text-white', rating: 4, height: 250, width: 32, starsColor: 'text-gray-900' },
  { id: 13, title: 'WHITE NIGHTS', author: 'DOSTOEVSKY', color: 'bg-[#f49315]', text: 'text-white', rating: 4, height: 250, width: 34, starsColor: 'text-white' },
  { id: 14, title: 'V FOR VENDETTA', author: 'MOORE', color: 'bg-[#f2c140]', text: 'text-gray-900', rating: 3, height: 260, width: 38, starsColor: 'text-gray-900' },
  { id: 15, title: 'OF MICE AND MEN', author: 'STEINBECK', color: 'bg-[#8944ab]', text: 'text-white', rating: 4, height: 180, width: 28, starsColor: 'text-yellow-300' },
  { id: 16, title: 'THE HOUSEKEEPER AND THE PROFESSOR', author: 'OGAWA', color: 'bg-[#3ba6d8]', text: 'text-white', rating: 5, height: 220, width: 34, starsColor: 'text-white' },
  { id: 17, title: 'THE MEMORY POLICE', author: 'OGAWA', color: 'bg-[#e90e63]', text: 'text-white', rating: 4, height: 260, width: 36, starsColor: 'text-yellow-300' },
  { id: 18, title: 'HATCHING TWITTER', author: 'BILTON', color: 'bg-[#f4c81a]', text: 'text-gray-900', rating: 4, height: 260, width: 38, starsColor: 'text-gray-900' },
  { id: 19, title: 'THE FALL', author: 'CAMUS', color: 'bg-[#1a384f]', text: 'text-white', rating: 4, height: 230, width: 30, starsColor: 'text-yellow-400' },
  { id: 20, title: 'HOLES', author: 'SACHAR', color: 'bg-[#1baab1]', text: 'text-white', rating: 4, height: 220, width: 34, starsColor: 'text-yellow-200' },
  { id: 21, title: 'BLACK EDGE', author: 'KOLHATKAR', color: 'bg-[#f18d0f]', text: 'text-gray-900', rating: 5, height: 250, width: 36, starsColor: 'text-gray-900' },
  { id: 22, title: 'COMPANY OF ONE', author: 'JARVIS', color: 'bg-[#7a787b]', text: 'text-pink-200', rating: 4, height: 250, width: 34, starsColor: 'text-pink-300' },
  { id: 23, title: 'GRIEF IS THE THING WITH FEATHERS', author: 'PORTER', color: 'bg-[#e2a099]', text: 'text-gray-900', rating: 4, height: 200, width: 28, starsColor: 'text-white' },
  { id: 24, title: "THE HOUSEMAID'S SECRET", author: 'MCFADDEN', color: 'bg-[#222126]', text: 'text-gray-300', rating: 3, height: 270, width: 38, starsColor: 'text-red-500' },
];

// --- UTILS ---
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

const getDeterminantColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

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

// The melody notes for "Norwegian Wood" - The Beatles (A Murakami favorite)
const MURAKAMI_TUNE = [
  329.63, // E4 (I)
  293.66, // D4 (once)
  329.63, // E4 (had)
  293.66, // D4 (a)
  329.63, // E4 (girl)
  246.94, // B3 (or)
  293.66, // D4 (should)
  261.63, // C4 (I)
  220.00  // A3 (say)
];

const playHoverNote = (index) => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  // Cycle through the melody as they hover over the books
  const freq = MURAKAMI_TUNE[index % MURAKAMI_TUNE.length];

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // 'triangle' gives a nice, soft electric-piano/vibraphone sound
  oscillator.type = 'triangle';
  oscillator.frequency.value = freq;

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05); // Gentle attack
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // Fade out

  oscillator.start(now);
  oscillator.stop(now + 1.5);
};

// Robust-enough CSV Parser for Goodreads export
const parseGoodreadsCSV = (csvText) => {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];

  // Parse headers
  const headers = lines[0].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(h => h.replace(/"/g, '').trim());
  const titleIdx = headers.indexOf('Title');
  const authorIdx = headers.indexOf('Author');
  const ratingIdx = headers.indexOf('My Rating');
  const pagesIdx = headers.indexOf('Number of Pages');
  const readDateIdx = headers.indexOf('Date Read');

  if (titleIdx === -1) throw new Error("Could not find 'Title' column in CSV.");

  const books = [];
  let idCounter = 1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle CSV quoting correctly
    const row = [];
    let current = '';
    let inQuotes = false;
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current);

    if (row.length > titleIdx && row[titleIdx]) {
      const title = row[titleIdx].replace(/"/g, '').trim();
      
      // Filter out empty rows or books not read
      if (!title) continue;
      
      const author = authorIdx !== -1 && row[authorIdx] ? row[authorIdx].replace(/"/g, '').trim().split(',')[0].split(' ').pop().toUpperCase() : 'UNKNOWN';
      const rating = ratingIdx !== -1 ? parseInt(row[ratingIdx]) : 0;
      const pages = pagesIdx !== -1 ? parseInt(row[pagesIdx]) : 300;
      const readDate = readDateIdx !== -1 ? row[readDateIdx].replace(/"/g, '').trim() : '';

      // Only include books read in the current year if a date exists, or all if no dates
      if (readDate && !readDate.includes('2025') && !readDate.includes('2024')) continue; // Tweak as needed

      const style = getDeterminantColor(title);
      
      // Calculate realistic heights/widths based on pages
      const height = Math.min(Math.max((pages / 2) + 100, 160), 320);
      const width = Math.min(Math.max((pages / 10) + 20, 24), 50);

      books.push({
        id: idCounter++,
        title: title.toUpperCase(),
        author: author,
        color: style.bg,
        text: style.text,
        starsColor: style.star,
        rating: isNaN(rating) ? 0 : rating,
        height,
        width
      });
    }
  }
  return books;
};


// --- COMPONENTS ---

// New Animated Cloud with Pixel Dithering
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
      {/* Cloud shape composed of solid and dithered blocks */}
      <div className="flex flex-col items-center justify-center">
        {/* Top block (dithered) */}
        <div className="w-16 h-4 dither-bg opacity-80"></div>
        
        {/* Middle block (solid) */}
        <div className="w-24 h-4 bg-white/95"></div>
        
        {/* Main block (solid with dithered shading on the bottom right) */}
        <div className="w-32 h-4 bg-white relative">
           <div className="absolute right-0 bottom-0 w-12 h-full dither-bg opacity-60"></div>
        </div>
        
        {/* Bottom block (dithered) */}
        <div className="w-20 h-4 dither-bg opacity-90 -mt-[1px]"></div>
      </div>
    </div>
  );
};


const Book = ({ book, index, soundEnabled, setTooltip }) => {
  // Calculate font sizes primarily based on spine width for a comfortable fit
  let maxTitleFsByWidth = book.width - 10; 
  let titleFontSize = Math.max(8, Math.min(13, maxTitleFsByWidth));

  let maxAuthorFsByWidth = book.width - 14;
  let authorFontSize = Math.max(7, Math.min(10, maxAuthorFsByWidth));

  // Use a slightly larger modifier (0.85) to ensure we safely overestimate the text length
  const titleHeightEst = book.title.length * titleFontSize * 0.85;
  const authorHeightEst = book.author.length * authorFontSize * 0.85;
  
  // 90px accounts for: Stars (~30px) + Gap between texts + Top/Bottom Padding (32px from py-4)
  const minTextHeight = titleHeightEst + authorHeightEst + 90;
  
  let finalHeight = Math.max(book.height, minTextHeight);

  // If it's absurdly tall, cap the height and shrink the font instead so it never overflows
  if (finalHeight > 400) {
    const scale = 400 / minTextHeight;
    titleFontSize = Math.max(6, titleFontSize * scale);
    authorFontSize = Math.max(5, authorFontSize * scale);
    finalHeight = 400;
  }

  return (
    <div 
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
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10 pointer-events-none rounded-t-sm"></div>
      
      {/* Stars - Fixed at top */}
      <div className={`flex flex-col mt-4 gap-[1px] shrink-0 z-10 ${book.starsColor}`}>
        {Array.from({ length: book.rating || 0 }).map((_, i) => (
          <span key={i} className="text-[6px] leading-none">★</span>
        ))}
      </div>

      {/* Spine Text - Native Vertical Flow */}
      <div 
        className="flex-1 w-full flex justify-between items-center py-4 z-10"
        style={{ writingMode: 'vertical-rl' }}
      >
        {/* Title (Starts at top) */}
        <span 
          className="font-bold whitespace-nowrap leading-none tracking-wide"
          style={{ fontSize: `${titleFontSize}px` }}
        >
          {book.title}
        </span>

        {/* Author Name (Pushed safely to the bottom by justify-between) */}
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
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [newBookForm, setNewBookForm] = useState({ title: '', author: '', rating: 5, pages: 300 });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  // Custom Hover Tooltip State
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, title: '', author: '', rating: 0 });

  const handleToggleSound = () => {
    if (!soundEnabled) {
      // Unlock the audio context on user click
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      // Play a silent note to force the browser to unlock audio
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

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBookForm.title.trim() || !newBookForm.author.trim()) return;

    const title = newBookForm.title.trim().toUpperCase();
    const author = newBookForm.author.trim().toUpperCase();
    const pages = parseInt(newBookForm.pages) || 300;
    const rating = parseInt(newBookForm.rating) || 0;

    const style = getDeterminantColor(title);
    
    // Calculate realistic heights/widths based on pages
    const height = Math.min(Math.max((pages / 2) + 100, 160), 320);
    const width = Math.min(Math.max((pages / 10) + 20, 24), 50);

    const newBook = {
      id: Date.now(),
      title,
      author,
      color: style.bg,
      text: style.text,
      starsColor: style.star,
      rating,
      height,
      width
    };

    setBooks(prev => [...prev, newBook]);
    setShowAddModal(false);
    setNewBookForm({ title: '', author: '', rating: 5, pages: 300 });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedBooks = parseGoodreadsCSV(event.target.result);
        if (parsedBooks.length === 0) {
          setError("No valid books found. Make sure this is a Goodreads CSV export.");
        } else {
          setBooks(parsedBooks);
          setShowModal(false);
          setError('');
        }
      } catch (err) {
        setError("Error parsing CSV. Please ensure it's a valid Goodreads export file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    // Updated background color to #386AF5
    <div className="min-h-screen bg-[#386AF5] relative overflow-hidden font-sans selection:bg-white/30 flex flex-col">
      
      {/* Custom Hover Tooltip */}
      {tooltip.show && (
        <div 
          className="fixed z-[100] pointer-events-none px-3 py-1.5 bg-[#3a2629]/95 backdrop-blur-sm text-white text-xs font-sans rounded shadow-xl border border-white/10 whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -180%)', // Shift up slightly above cursor and center
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
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all flex items-center gap-2 border border-white/10 shadow-sm"
          >
            <Plus size={16} />
            Add Book
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all flex items-center gap-2 border border-white/10 shadow-sm"
          >
            <Upload size={16} />
            Import CSV
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
                <Book key={book.id} book={book} index={index} soundEnabled={soundEnabled} setTooltip={setTooltip} />
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
              {books.length > 0 && (
                <button 
                  onClick={() => setBooks([])}
                  className="text-white/30 hover:text-white/80 text-[10px] uppercase tracking-wider transition-colors font-semibold drop-shadow-sm"
                >
                  Clear Shelf
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Goodreads Import Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-serif text-gray-900 mb-2">Connect Goodreads</h3>
            <p className="text-gray-600 text-sm mb-6">
              Goodreads disabled their developer API, so we can't connect automatically. Instead, you can export your library and drop the file here!
            </p>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-6 flex gap-3 items-start border border-blue-100">
              <Info className="shrink-0 mt-0.5" size={18} />
              <div>
                <strong>How to get your CSV:</strong>
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                  <li>Go to Goodreads.com and log in.</li>
                  <li>Click "My Books" in the header.</li>
                  <li>Scroll to the bottom left and click "Import and export".</li>
                  <li>Click the "Export Library" button and save the CSV.</li>
                </ol>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {error}
              </div>
            )}

            <input 
              type="file" 
              accept=".csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#386AF5] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Select Goodreads CSV File
            </button>
            
            <button 
              onClick={() => {
                setBooks(INITIAL_BOOKS);
                setShowModal(false);
              }}
              className="w-full mt-3 text-gray-500 hover:text-gray-800 py-2 text-sm font-medium"
            >
              Load Demo Shelf
            </button>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-serif text-gray-900 mb-6">Add a Book</h3>
            
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={newBookForm.title}
                  onChange={e => setNewBookForm({...newBookForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. The Hobbit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author (Last Name)</label>
                <input 
                  type="text" 
                  required
                  value={newBookForm.author}
                  onChange={e => setNewBookForm({...newBookForm, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Tolkien"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pages (Thickness)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newBookForm.pages}
                    onChange={e => setNewBookForm({...newBookForm, pages: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select 
                    value={newBookForm.rating}
                    onChange={e => setNewBookForm({...newBookForm, rating: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {[5,4,3,2,1,0].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Star' : 'Stars'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full mt-4 bg-[#386AF5] hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Plus size={18} />
                Add to Shelf
              </button>
            </form>
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