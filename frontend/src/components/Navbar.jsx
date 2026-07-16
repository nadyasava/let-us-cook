const TABS = [
  { id: 'cook', label: 'Masak' },
  { id: 'fridge', label: 'Kulkas' },
  { id: 'saved', label: 'Favorit & Riwayat' },
]

export default function Navbar({ active, onChange }) {
  return (
    <header className="sticky top-0 z-20 bg-paper/90 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍳</span>
          <span className="font-display text-xl font-semibold tracking-tight">
            LetUsCook!
          </span>
        </div>
        <nav className="flex gap-1 bg-surface border border-border rounded-full p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                active === tab.id
                  ? 'bg-ink text-paper'
                  : 'text-ink/60 hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
