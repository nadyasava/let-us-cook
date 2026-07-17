import { useState } from 'react'
import { api } from '../api'

export default function RecipeDetail({ recipe, onClose, isFavorite, onToggleFavorite }) {
  const [busy, setBusy] = useState(false)

  if (!recipe) return null

  async function toggleFavorite() {
    setBusy(true)
    try {
      if (isFavorite) {
        await api.removeFavorite(recipe.id)
      } else {
        await api.addFavorite(recipe.id, {
          match_score: recipe.match_score,
          missing_ingredients: recipe.missing_ingredients,
          is_primary_match: recipe.is_primary_match,
        })
      }
      onToggleFavorite?.()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-ink/40 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="bg-paper w-full md:max-w-2xl md:rounded-card rounded-t-card max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-3xl font-semibold">{recipe.name}</h2>
            <p className="text-sm text-ink/50 mt-1">
              {recipe.cook_time_minutes} menit &middot; {recipe.difficulty}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 shrink-0 rounded-full border border-border flex items-center justify-center hover:border-ink/40"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            ['Kalori', `${recipe.calories}`],
            ['Protein', `${recipe.protein_g}g`],
            ['Karbo', `${recipe.carbs_g}g`],
            ['Lemak', `${recipe.fat_g}g`],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface border border-border rounded-xl py-3 text-center">
              <p className="font-mono text-lg font-semibold">{value}</p>
              <p className="text-[11px] text-ink/50">{label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Bahan</h3>
          <ul className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ing) => {
              const missing = recipe.missing_ingredients?.includes(ing)
              return (
                <li
                  key={ing}
                  className={`text-xs px-3 py-1.5 rounded-full border capitalize ${
                    missing
                      ? 'border-tomato/40 text-tomato bg-tomato/5'
                      : 'border-sage/40 text-sage bg-sage/5'
                  }`}
                >
                  {ing}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Langkah memasak</h3>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-ink text-paper text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-ink/80 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <button
          onClick={toggleFavorite}
          disabled={busy}
          className={`w-full py-2.5 rounded-full text-sm font-medium transition ${
            isFavorite
              ? 'bg-tomato/10 text-tomato border border-tomato/30'
              : 'bg-ink text-paper hover:opacity-90'
          }`}
        >
          {isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
        </button>
      </div>
    </div>
  )
}
