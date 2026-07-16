const BASE = '/api'

async function handle(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`)
  }
  return data
}

export const api = {
  detectFood: (file) => {
    const form = new FormData()
    form.append('image', file)
    return fetch(`${BASE}/detect`, { method: 'POST', body: form }).then(handle)
  },

  recommendRecipes: (ingredients = []) => {
  const params = new URLSearchParams({
    detected_food: ingredients.join(","),
  })

  return fetch(
    `${BASE}/recipes/recommend?${params}`
  ).then(handle)
},

  listRecipes: () => fetch(`${BASE}/recipes`).then(handle),

  getRecipe: (id) => fetch(`${BASE}/recipes/${id}`).then(handle),

  listFavorites: () => fetch(`${BASE}/favorites`).then(handle),

  addFavorite: (id) => fetch(`${BASE}/favorites/${id}`, { method: 'POST' }).then(handle),

  removeFavorite: (id) => fetch(`${BASE}/favorites/${id}`, { method: 'DELETE' }).then(handle),

  listHistory: () => fetch(`${BASE}/history`).then(handle),
}
