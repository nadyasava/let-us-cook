function gaugeColor(score) {
  if (score >= 80) return '#4C7A5A' // sage
  if (score >= 40) return '#F2B705' // yolk
  return '#E2492F' // tomato
}

function MatchGauge({ score }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)
  const color = gaugeColor(score)

  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#E4E2D8" strokeWidth="5" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {score}%
      </span>
    </div>
  )
}

export default function RecipeCard({ recipe, onOpen }) {
  return (
    <button
      onClick={() => onOpen(recipe)}
      className="text-left w-full bg-surface border border-border rounded-card p-4 flex gap-4 items-center hover:border-ink/30 transition"
    >
      <MatchGauge score={recipe.match_score ?? 100} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-lg truncate">{recipe.name}</h3>
          {recipe.is_primary_match && (
            <span className="text-[10px] uppercase tracking-wide bg-yolk/20 text-ink/70 px-2 py-0.5 rounded-full shrink-0">
              cocok
            </span>
          )}
        </div>
        <p className="text-xs text-ink/50 mt-0.5">
          {recipe.cook_time_minutes} menit &middot; {recipe.difficulty} &middot; {recipe.calories} kal
        </p>
        {recipe.missing_ingredients?.length > 0 && (
          <p className="text-xs text-tomato mt-1 truncate">
            Kurang: {recipe.missing_ingredients.join(', ')}
          </p>
        )}
      </div>
    </button>
  )
}
