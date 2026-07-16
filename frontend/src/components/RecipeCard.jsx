import { Badge, DifficultyFlames } from "./ui"; 

function getEmoji(recipe) {
  const emojis = {
    egg: "🍳",
    chicken: "🍗",
    tofu: "🥢",
    spinach: "🥬",
    beef: "🥩",
    salmon: "🐟",
    tempe: "🍘" ,
  };
  return emojis[recipe.main_ingredient] || "🍲";
}

export default function RecipeCard({ recipe, onOpen, onToggleFavorite, hideMatchScore }) {
  const matchPercent = recipe.match_score ?? 0;
  const missingCount = recipe.missing_ingredients?.length ?? 0;

  // 1. Logika penentuan tone warna berdasarkan persentase
  let matchTone = "cabai";
  if (matchPercent >= 80) matchTone = "daun";
  else if (matchPercent >= 40) matchTone = "kunyit";

  // 2. Pemetaan warna fallback dengan Tailwind standar agar warna HIJAU, KUNING, MERAH pasti menyala tajam
  const matchColors = {
    daun: "bg-green-50 border-green-200/80 text-green-700",
    kunyit: "bg-amber-50 border-amber-200/80 text-amber-700",
    cabai: "bg-red-50 border-red-200/80 text-red-600",
  };

  return (
    <div
      className="
        group
        relative
        flex
        flex-col
        justify-between
        rounded-2xl
        bg-white
        p-5
        shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        border border-gray-100/80
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* Top Right Utilities Area */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe);
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-gray-50/80
              backdrop-blur-sm
              text-lg
              shadow-sm
              border border-gray-100
              hover:bg-white
              hover:scale-105
              active:scale-95
              transition-all
            "
            title={recipe.is_favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
          >
            {recipe.is_favorite ? "⭐" : "☆"}
          </button>
        )}

        {/* Enhanced Match Score (Warna berubah dinamis di sini) */}
        {!hideMatchScore && (
          <div
            className={`
              flex
              flex-col
              items-center
              justify-center
              min-w-[56px]
              h-[56px]
              rounded-xl
              border
              p-1
              leading-none
              shadow-sm
              transition-colors
              duration-300
              ${matchColors[matchTone]}
            `}
          >
            <span className="text-xl font-extrabold tracking-tighter">
              {matchPercent}%
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5 opacity-90">
              Cocok
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        {/* Header: Emoji & Titles */}
        <div className="flex items-start gap-4 pr-24"> 
          <div className="
            flex 
            h-14 
            w-14 
            shrink-0 
            items-center 
            justify-center 
            rounded-2xl 
            bg-gray-50 
            text-3xl
            border border-gray-100
          ">
            {getEmoji(recipe)}
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
              {recipe.name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                ⏱ {recipe.cook_time_minutes} min
              </span>
              <span className="text-gray-300">•</span>
              <DifficultyFlames difficulty={recipe.difficulty} />
            </div>
          </div>
        </div>

        {/* Dynamic Badges & Availability Status */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {missingCount === 0 ? (
            <Badge tone="daun">✅ Semua bahan siap</Badge>
          ) : (
            <Badge tone="cabai">🛒 Kurang {missingCount} bahan</Badge>
          )}
          
          <Badge tone="kunyit">🔥 {recipe.calories} kkal</Badge>
          
          {recipe.is_primary_match && (
            <Badge tone="daun">⭐ Bahan utama pas</Badge>
          )}
        </div>

        {/* Missing Ingredients Alert */}
        {missingCount > 0 && (
          <div className="mt-3 rounded-xl bg-red-50/40 px-3 py-2 border border-red-100/50">
            <p className="text-xs text-red-700 font-medium line-clamp-2">
              <span className="font-bold">Beli:</span>{" "}
              {recipe.missing_ingredients.join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* Action Button: Full Width & Modern */}
      <div className="mt-5">
        <button
          onClick={() => onOpen(recipe)}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gray-900
            px-4
            py-2.5
            text-xs
            font-bold
            text-white
            shadow-sm
            hover:bg-gray-800
            active:scale-[0.99]
            transition-all
          "
        >
          Lihat Detail Resep
          <svg 
            className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}