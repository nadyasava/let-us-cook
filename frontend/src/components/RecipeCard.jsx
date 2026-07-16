function getEmoji(recipe) {
  const emojis = {
    egg: "🍳",
    chicken: "🍗",
    tofu: "🥢",
    spinach: "🥬",
    beef: "🥩",
    salmon: "🐟",
    tempeh: "🍘",
  }

  return emojis[recipe.main_ingredient] || "🍲"
}


function Badge({ children, tone = "daun" }) {
  const tones = {
    daun: "bg-green-100 text-green-700 border-green-200",
    kunyit: "bg-yellow-100 text-yellow-700 border-yellow-200",
    cabai: "bg-red-100 text-red-700 border-red-200",
    ink: "bg-gray-100 text-gray-700 border-gray-200",
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 
        rounded-full border px-2.5 py-1 
        text-xs font-semibold
        ${tones[tone]}
      `}
    >
      {children}
    </span>
  )
}


function DifficultyFlames({ difficulty }) {
  const map = {
    Easy: 1,
    Mudah: 1,

    Medium: 2,
    Sedang: 2,

    Hard: 3,
    Sulit: 3,
  }

  const count = map[difficulty] || 1


  return (
    <span className="inline-flex items-center gap-1">
      {[0,1,2].map((i)=>(
        <span 
          key={i}
          className={i < count ? "opacity-100" : "opacity-20"}
        >
          🔥
        </span>
      ))}

      <span className="ml-1 text-xs font-semibold text-gray-500">
        {difficulty}
      </span>
    </span>
  )
}


export default function RecipeCard({
  recipe,
  onOpen,
  onToggleFavorite
}) {

  const matchPercent = recipe.match_score ?? 0

  const missingCount =
    recipe.missing_ingredients?.length ?? 0


  let matchTone = "cabai"

  if(matchPercent >= 80){
    matchTone = "daun"
  }
  else if(matchPercent >= 40){
    matchTone = "kunyit"
  }


  const matchColors = {
    daun:
      "border-green-500/60 text-green-700",

    kunyit:
      "border-yellow-500/60 text-yellow-700",

    cabai:
      "border-red-500/60 text-red-700",
  }


  return (
    <div
      className="
        rounded-2xl
        bg-white
        p-5
        shadow-lg
        border border-gray-100
        hover:-translate-y-1
        transition
      "
    >

      {/* Header */}
      <div className="
        flex
        items-start
        justify-between
        gap-3
      ">

        <div className="
          flex
          items-start
          gap-3
        ">

          <span className="text-4xl">
            {getEmoji(recipe)}
          </span>


          <div>

            <h3
              className="
                text-lg
                font-bold
                text-gray-800
                leading-tight
              "
            >
              {recipe.name}
            </h3>


            <div className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-3
              text-xs
              text-gray-500
            ">

              <span>
                ⏱ {recipe.cook_time_minutes} menit
              </span>


              <DifficultyFlames
                difficulty={recipe.difficulty}
              />

            </div>

          </div>

        </div>



        {/* Match Score */}

        <div
          className={`
            shrink-0
            rounded-xl
            border-2
            px-3
            py-2
            text-center
            ${matchColors[matchTone]}
          `}
        >

          <p className="
            font-bold
            text-lg
            leading-none
          ">
            {matchPercent}%
          </p>


          <p className="
            text-[10px]
            uppercase
            tracking-wide
            font-semibold
          ">
            cocok
          </p>

        </div>

      </div>



      {/* Badge */}

      <div className="
        mt-4
        flex
        flex-wrap
        gap-2
      ">

        {
          missingCount === 0 ?

          (
            <Badge tone="daun">
              ✅ Semua bahan tersedia
            </Badge>
          )

          :

          (
            <Badge tone="cabai">
              🛒 Kurang {missingCount} bahan
            </Badge>
          )
        }


        <Badge tone="kunyit">
          🔥 {recipe.calories} kkal
        </Badge>


        {
          recipe.is_primary_match &&
          (
            <Badge tone="daun">
              ⭐ Bahan utama cocok
            </Badge>
          )
        }


      </div>




      {/* Missing ingredients */}

      {
        missingCount > 0 &&

        <p className="
          mt-3
          text-xs
          text-red-600
          truncate
        ">
          Kurang:
          {" "}
          {recipe.missing_ingredients.join(", ")}
        </p>

      }



      {/* Action */}

      <div className="
        mt-5
        flex
        items-center
        justify-between
      ">


        <button
          onClick={()=>onOpen(recipe)}
          className="
            rounded-full
            bg-green-600
            px-5
            py-2
            text-sm
            font-semibold
            text-white
            shadow-md
            hover:bg-green-700
            hover:-translate-y-0.5
            transition
          "
        >
          Lihat resep →
        </button>



        {
          onToggleFavorite &&

          <button
            onClick={()=>
              onToggleFavorite(recipe)
            }
            className="
              rounded-full
              p-2
              text-2xl
              hover:scale-110
              transition
            "
          >
            {
              recipe.is_favorite
              ?
              "⭐"
              :
              "☆"
            }

          </button>
        }


      </div>


    </div>
  )
}