import { useEffect, useState } from 'react'
import { api } from '../api'
import RecipeCard from './RecipeCard'

export default function FavoritesHistory({ mode, onOpen }) {
  const [list, setList] = useState([])

  async function refresh() {
    const data = mode === 'history' ? await api.listHistory() : await api.listFavorites()
    setList(data)
  }

  useEffect(() => {
    refresh()
  }, [mode])

  return (
    <section className="max-w-3xl mx-auto py-10">
      {list.length === 0 ? (
        <p className="text-sm text-ink/40 italic">
          {mode === 'history'
            ? 'Belum ada resep yang dibuka.'
            : 'Belum ada resep favorit. Simpan resep dari halaman Masak.'}
        </p>
      ) : (
        <div className="grid gap-3">
          {list.map((recipe) => (
            <RecipeCard
              key={`${mode}-${recipe.id}`}
              recipe={recipe}
              onOpen={onOpen}
              hideMatchScore={mode === 'history'}
            />
          ))}
        </div>
      )}
    </section>
  )
}
