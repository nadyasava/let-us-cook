import { useEffect, useState } from 'react'
import { api } from '../api'
import RecipeCard from './RecipeCard'

export default function FavoritesHistory({ onOpen }) {
  const [tab, setTab] = useState('favorites')
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])

  async function refresh() {
    const [f, h] = await Promise.all([api.listFavorites(), api.listHistory()])
    setFavorites(f)
    setHistory(h)
  }

  useEffect(() => {
    refresh()
  }, [])

  const list = tab === 'favorites' ? favorites : history

  return (
    <section className="max-w-3xl mx-auto py-10">
      <div className="flex gap-2 mb-6">
        {[
          ['favorites', 'Favorit'],
          ['history', 'Riwayat'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              tab === id ? 'bg-ink text-paper border-ink' : 'border-border text-ink/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-ink/40 italic">
          {tab === 'favorites'
            ? 'Belum ada resep favorit. Simpan resep dari halaman Masak.'
            : 'Belum ada resep yang dibuka.'}
        </p>
      ) : (
        <div className="grid gap-3">
          {list.map((recipe) => (
            <RecipeCard key={`${tab}-${recipe.id}`} recipe={recipe} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  )
}
