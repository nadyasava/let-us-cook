import { useEffect, useState } from 'react'
import { api } from './api'

import Navbar from './components/Navbar'
import UploadPhoto from './components/UploadPhoto'
import ConfirmIngredients from './components/ConfirmIngredients'
import RecipeCard from './components/RecipeCard'
import RecipeDetail from './components/RecipeDetail'
import FavoritesHistory from './components/FavoritesHistory'

export default function App() {
  const [tab, setTab] = useState("cook")
  const [activeStep, setActiveStep] = useState(1)
  const [detectedFood, setDetectedFood] = useState(null)
  const [finalIngredients, setFinalIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [activeRecipe, setActiveRecipe] = useState(null)
  const [favoriteIds, setFavoriteIds] = useState(new Set())

  async function refreshFavoriteIds() {
    const favs = await api.listFavorites()
    setFavoriteIds(new Set(favs.map(f => f.id)))
  }

  useEffect(() => {
    refreshFavoriteIds()
  }, [])

  async function handleFindRecipes(ingredientsList) {
    setFinalIngredients(ingredientsList)
    setActiveStep(3)
    setLoadingRecipes(true)

    try {
      const ingredientNames = ingredientsList.map(i => i.name.toLowerCase())
      const data = await api.recommendRecipes(ingredientNames)
      setRecipes(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingRecipes(false)
    }
  }

  function handleReset() {
    setDetectedFood(null)
    setFinalIngredients([])
    setRecipes([])
    setActiveStep(1)
  }

  function handleOpenRecipe(recipe) {
    setActiveRecipe(recipe)
    api.getRecipe(recipe.id).catch(() => {})
  }

  const stepsConfig = [
    { number: 1, label: "Ambil Foto" },
    { number: 2, label: "Konfirmasi Bahan" },
    { number: 3, label: "Rekomendasi Resep" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-paper via-paper to-border/20 text-ink pb-20 font-sans antialiased">
      <Navbar active={tab} onChange={setTab} />

      <main className="px-6 max-w-3xl mx-auto">
        {tab === "cook" && (
          <>
            {/* TEXT HEADER UTAMA DARI UPLOADPHOTO */}
            <div className="text-center pt-10">
              <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-2 tracking-tight text-ink">
                Apa yang ada di kulkasmu hari ini?
              </h1>
              <p className="text-sm text-ink/60 max-w-md mx-auto leading-relaxed">
                Foto atau unggah bahan makananmu, biar <span className="font-semibold text-ink">LetUsCook!</span> yang cari tahu resep terbaiknya.
              </p>
            </div>

            {/* STEPPER MODERN DENGAN LOGIKA GARIS MURNI DI ANTARA DUA STEP */}
            <div className="py-8 max-w-xl mx-auto">
              <div className="flex items-center w-full">

                {stepsConfig.map((step, index) => {
                  const isCompleted = activeStep > step.number
                  const isActive = activeStep === step.number

                  return (
                    <div key={step.number} className="flex flex-1 items-center last:flex-none">

                      {/* 1. BULATAN & LABEL STEP */}
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            font-bold text-sm transition-all duration-300 transform z-10
                            ${isActive ? 'scale-110 shadow-lg shadow-ink/10 ring-4 ring-ink/15' : 'scale-100'}
                            ${
                              isCompleted || isActive
                                ? "bg-ink text-paper"
                                : "bg-border text-ink/40 border border-ink/5"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            step.number
                          )}
                        </div>

                        <span
                          className={`
                            absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wide transition-colors duration-300
                            ${isActive ? 'text-ink font-bold' : isCompleted ? 'text-ink/75' : 'text-ink/40'}
                          `}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* 2. LOGIKA GARIS PENGHUBUNG (Hanya dirender jika ada step berikutnya) */}
                      {index < stepsConfig.length - 1 && (
                        <div className="flex-1 mx-2 h-1 bg-border rounded-full relative z-0">
                          <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-ink via-ink/80 to-ink/60 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: activeStep > step.number ? '100%' : '0%'
                            }}
                          />
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* SPACER */}
            <div className="h-8" />

            {/* KONTEN BERDASARKAN STEP */}
            {activeStep === 1 && (
              <UploadPhoto
                onDetected={(food) => {
                  setDetectedFood(food)
                  setActiveStep(2)
                }}
              />
            )}

            {activeStep === 2 && (
              <ConfirmIngredients
                initialFood={detectedFood}
                onBack={handleReset}
                onConfirm={handleFindRecipes}
              />
            )}

            {activeStep === 3 && (
              <section className="animate-fadeIn">
                {loadingRecipes ? (
                  <div className="text-center py-16 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-ink/10 border-t-ink rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium text-ink/60 animate-pulse">
                      Meracik rekomendasi lezat untukmu...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 p-4 bg-border/20 rounded-2xl backdrop-blur-sm border border-border/10">
                      <h2 className="text-2xl font-bold tracking-tight">
                        Rekomendasi Resep
                      </h2>
                      <p className="text-xs font-medium text-ink/60 mt-1">
                        Bahan yang digunakan:{" "}
                        <span className="text-ink font-semibold">
                          {finalIngredients.map(i => i.name).join(", ")}
                        </span>
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {recipes.map(recipe => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onOpen={handleOpenRecipe}
                        />
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}
          </>
        )}

        {tab === "saved" && <FavoritesHistory onOpen={handleOpenRecipe} />}
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
