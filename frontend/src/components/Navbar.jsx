import { useState } from 'react';

const TABS = [
  { id: 'cook', label: 'Masak' },
  { id: 'favorites', label: 'Favorit' },
  { id: 'history', label: 'Riwayat' },
];

export default function Navbar({ active, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (id) => {
    onChange(id);
    setIsOpen(false); // Otomatis tutup menu di mobile setelah milih tab
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        {/* Main Header Container */}
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img 
              src="public/logo.png" 
              alt="LetUsCook Logo" 
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'block';
                }
              }}
            />
            {/* Fallback Emoji jika gambar gagal load */}
            <span className="text-2xl hidden">🍳</span>
            
            <span className="font-sans text-lg font-extrabold tracking-tight text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              LetUsCook!
            </span>
          </div>

          {/* Desktop Navigation (Sembunyi di mobile, muncul di medium screen ke atas) */}
          <nav className="hidden md:flex gap-1 bg-gray-100/80 p-1 rounded-full border border-gray-200/50">
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    relative
                    px-4 
                    py-1.5 
                    rounded-full 
                    text-xs 
                    font-bold 
                    tracking-wide
                    transition-all 
                    duration-200
                    ${
                      isActive
                        ? 'bg-gray-950 text-white shadow-sm scale-[1.02]'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Hamburger Button (Hanya muncul di mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              {/* Animasi Garis Hamburger menjadi "X" */}
              <span className={`w-full h-0.5 bg-gray-900 rounded transition-all duration-300 transform origin-left ${isOpen ? 'rotate-45 translate-x-[2px] translate-y-[-1px]' : ''}`} />
              <span className={`w-full h-0.5 bg-gray-900 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-gray-900 rounded transition-all duration-300 transform origin-left ${isOpen ? '-rotate-45 translate-x-[2px] translate-y-[1px]' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Dropdown (Transisi Smooth Expand) */}
        <div
          className={`
            md:hidden 
            overflow-hidden 
            transition-all 
            duration-300 
            ease-in-out
            ${isOpen ? 'max-h-48 opacity-100 pb-4' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
        >
          <nav className="flex flex-col gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-200/50">
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`
                    w-full
                    text-left
                    px-4 
                    py-2.5 
                    rounded-xl 
                    text-sm 
                    font-bold 
                    transition-all 
                    duration-200
                    ${
                      isActive
                        ? 'bg-gray-950 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-950 hover:bg-gray-200/50'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
}