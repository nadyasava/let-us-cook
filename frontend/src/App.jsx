import { useEffect, useState } from 'react'
import { api } from './api'

import Navbar from './components/Navbar'
import UploadPhoto from './components/UploadPhoto'
import ConfirmIngredients from './components/ConfirmIngredients'
import RecipeCard from './components/RecipeCard'
import RecipeDetail from './components/RecipeDetail'
import FavoritesHistory from './components/FavoritesHistory'


export default function App(){

const [tab,setTab]=useState("cook")

const [activeStep,setActiveStep]=useState(1)

const [detectedFood,setDetectedFood]=useState(null)

const [finalIngredients,setFinalIngredients]=useState([])

const [recipes,setRecipes]=useState([])

const [loadingRecipes,setLoadingRecipes]=useState(false)

const [activeRecipe,setActiveRecipe]=useState(null)

const [favoriteIds,setFavoriteIds]=useState(new Set())



async function refreshFavoriteIds(){

 const favs = await api.listFavorites()

 setFavoriteIds(
   new Set(
     favs.map(f=>f.id)
   )
 )

}



useEffect(()=>{
 refreshFavoriteIds()
},[])




async function handleFindRecipes(
 ingredientsList
){

 setFinalIngredients(
   ingredientsList
 )


 setActiveStep(3)

 setLoadingRecipes(true)



 try{


   const ingredientNames =
    ingredientsList.map(
      i=>i.name.toLowerCase()
    )


   const data =
    await api.recommendRecipes(
      ingredientNames
    )


   setRecipes(data)



 }catch(err){

   console.error(err)

 }

 finally{

   setLoadingRecipes(false)

 }

}




function handleReset(){

 setDetectedFood(null)

 setFinalIngredients([])

 setRecipes([])

 setActiveStep(1)

}



function handleOpenRecipe(recipe){

 setActiveRecipe(recipe)

 api.getRecipe(recipe.id).catch(()=>{})

}



return(

<div className="min-h-screen bg-paper text-ink pb-20">


<Navbar
 active={tab}
 onChange={setTab}
/>



<main className="px-6 max-w-3xl mx-auto">



{
tab==="cook" &&

<>


<div className="flex items-center justify-center gap-4 py-8">

{
[1,2,3].map(step=>(

<div
key={step}
className={`
w-8 h-8 rounded-full flex items-center justify-center
font-semibold text-sm
${
activeStep>=step
?
"bg-ink text-paper"
:
"bg-border text-ink/40"
}
`}
>

{step}

</div>

))
}

</div>





{
activeStep===1 &&

<UploadPhoto

onDetected={(food)=>{

setDetectedFood(food)

setActiveStep(2)

}}

/>

}




{
activeStep===2 &&

<ConfirmIngredients

initialFood={detectedFood}

onBack={handleReset}

onConfirm={handleFindRecipes}

/>

}




{
activeStep===3 &&

<section>


{
loadingRecipes ?

<div className="text-center py-10">

<p>
Meracik rekomendasi...
</p>

</div>


:


<>


<div className="mb-6">

<h2 className="text-2xl font-semibold">
Rekomendasi resep
</h2>


<p className="text-xs text-ink/50">

Bahan:

{" "}

{
finalIngredients
.map(
i=>i.name
)
.join(", ")
}

</p>


</div>



<div className="grid gap-4">

{
recipes.map(
recipe=>(

<RecipeCard

key={recipe.id}

recipe={recipe}

onOpen={handleOpenRecipe}

/>

)

)

}

</div>


</>


}



</section>

}



</>

}



{
tab==="saved" &&
<FavoritesHistory
onOpen={handleOpenRecipe}
/>

}



</main>



<RecipeDetail

recipe={activeRecipe}

isFavorite={
activeRecipe
?
favoriteIds.has(activeRecipe.id)
:
false
}

onToggleFavorite={
refreshFavoriteIds
}

onClose={()=>
setActiveRecipe(null)
}

/>



</div>

)

}