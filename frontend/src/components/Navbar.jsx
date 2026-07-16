const TABS = [
  { id: 'cook', label: 'Masak' },
  { id: 'fridge', label: 'Kulkas' },
  { id: 'saved', label: 'Favorit & Riwayat' },
]

export default function Navbar({ active, onChange }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img 
            src="public/logo.png" 
            alt="LetUsCook Logo" 
            className="h-9 w-auto object-contain"
            onError={(e) => {
              // Fallback jika path asset bermasalah saat development
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback Emoji jika gambar gagal load */}
          <span className="text-2xl hidden">🍳</span>
          
          <span className="font-sans text-lg font-extrabold tracking-tight text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            LetUsCook!
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-1 bg-gray-100/80 p-1 rounded-full border border-gray-200/50">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
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
        
      </div>
    </header>
  )
}