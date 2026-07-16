import { useEffect, useState } from 'react'
import { api } from '../api'

export default function IngredientManager() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('pcs')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)

  async function refresh() {
    try {
      setItems(await api.listIngredients())
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)
    try {
      if (editingId) {
        await api.updateIngredient(editingId, { name, quantity, unit })
      } else {
        await api.addIngredient({ name, quantity, unit })
      }
      setName('')
      setQuantity(1)
      setUnit('pcs')
      setEditingId(null)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(item) {
    setEditingId(item.id)
    setName(item.name)
    setQuantity(item.quantity)
    setUnit(item.unit)
  }

  async function handleDelete(id) {
    await api.deleteIngredient(id)
    if (editingId === id) {
      setEditingId(null)
      setName('')
    }
    refresh()
  }

  return (
    <section className="max-w-3xl mx-auto py-10">
      <h2 className="font-display text-3xl font-semibold mb-1">Isi kulkasmu</h2>
      <p className="text-ink/60 mb-6">
        Catat bahan yang kamu punya, biar rekomendasi resep lebih akurat.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 bg-surface border border-border rounded-card p-4 mb-6"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="nama bahan, mis. telur"
          className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-border bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-yolk"
        />
        <input
          type="number"
          min="0"
          step="0.5"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-24 px-3 py-2 rounded-lg border border-border bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-yolk"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-28 px-3 py-2 rounded-lg border border-border bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-yolk"
        >
          <option value="pcs">pcs</option>
          <option value="gram">gram</option>
          <option value="ml">ml</option>
          <option value="siung">siung</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-ink text-paper text-sm font-medium hover:opacity-90 transition"
        >
          {editingId ? 'Simpan' : 'Tambah'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setName('')
              setQuantity(1)
              setUnit('pcs')
            }}
            className="px-4 py-2 rounded-lg border border-border text-sm"
          >
            Batal
          </button>
        )}
      </form>

      {error && <p className="text-sm text-tomato mb-4">{error}</p>}

      {items.length === 0 ? (
        <p className="text-sm text-ink/40 italic">
          Kulkasmu masih kosong di sini. Tambahkan bahan pertama di atas.
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3"
            >
              <div>
                <p className="font-medium capitalize">{item.name}</p>
                <p className="text-xs text-ink/50">
                  {item.quantity} {item.unit}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-ink/40"
                >
                  Ubah
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs px-3 py-1.5 rounded-full border border-tomato/30 text-tomato hover:bg-tomato/10"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
