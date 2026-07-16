import { useEffect, useState } from 'react'
import { api } from './api'
import Navbar from './components/Navbar'
import UploadPhoto from './components/UploadPhoto'
import IngredientManager from './components/IngredientManager'
import RecipeCard from './components/RecipeCard'
import RecipeDetail from './components/RecipeDetail'
import FavoritesHistory from './components/FavoritesHistory'

export default function App() {
  const [tab, setTab] = useState('cook')
  const [detectedFood, setDetectedFood] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [activeRecipe, setActiveRecipe] = useState(null)
  const [favoriteIds, setFavoriteIds] = useState(new Set())

  async function refreshFavoriteIds() {
    const favs = await api.listFavorites()
    setFavoriteIds(new Set(favs.map((f) => f.id)))
  }

  useEffect(() => {
    refreshFavoriteIds()
  }, [])

  useEffect(() => {
    if (!detectedFood) return
    setLoadingRecipes(true)
    api
      .recommendRecipes(detectedFood)
      .then(setRecipes)
      .finally(() => setLoadingRecipes(false))
  }, [detectedFood])

  return (
    <div className="min-h-screen">
      <Navbar active={tab} onChange={setTab} />

      <main className="px-6">
        {tab === 'cook' && (
          <>
            <UploadPhoto onDetected={setDetectedFood} />

            <section className="max-w-3xl mx-auto pb-16">
              {loadingRecipes && (
                <p className="text-center text-sm text-ink/50 animate-pulse">
                  Mencari resep yang cocok...
                </p>
              )}

              {!loadingRecipes && recipes.length > 0 && (
                <>
                  <h2 className="font-display text-2xl font-semibold mb-4">
                    Rekomendasi resep
                  </h2>
                  <div className="grid gap-3">
                    {recipes.map((r) => (
                      <RecipeCard key={r.id} recipe={r} onOpen={setActiveRecipe} />
                    ))}
                  </div>
                </>
              )}
            </section>
          </>
        )}

        {tab === 'fridge' && <IngredientManager />}

        {tab === 'saved' && <FavoritesHistory onOpen={setActiveRecipe} />}
      </main>

      <RecipeDetail
        recipe={activeRecipe}
        isFavorite={activeRecipe ? favoriteIds.has(activeRecipe.id) : false}
        onToggleFavorite={refreshFavoriteIds}
        onClose={() => setActiveRecipe(null)}
      />
    </div>
  )
}
