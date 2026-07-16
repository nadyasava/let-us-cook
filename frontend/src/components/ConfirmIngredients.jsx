import { useState } from 'react'

const UNIT_OPTIONS = ['pcs', 'gram', 'kg', 'ml', 'liter', 'sdm', 'siung', 'butir']

export default function ConfirmIngredients({ initialFood, onBack, onConfirm }) {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: initialFood || '', quantity: 1, unit: 'pcs' }
  ])

  const [newItemName, setNewItemName] = useState('')
  const [newItemQty, setNewItemQty] = useState(1)
  const [newItemUnit, setNewItemUnit] = useState('pcs')

  function handleAddIngredient() {
    if (!newItemName.trim()) return
    
    const newId = ingredients.length ? Math.max(...ingredients.map(i => i.id)) + 1 : 1
    
    setIngredients([
      ...ingredients,
      { 
        id: newId, 
        name: newItemName.trim(), 
        quantity: newItemQty, 
        unit: newItemUnit 
      }
    ])

    setNewItemName('')
    setNewItemQty(1)
    setNewItemUnit('pcs')
  }

  function handleRemoveIngredient(id) {
    setIngredients(ingredients.filter((item) => item.id !== id))
  }

  function handleUpdateIngredient(id, field, value) {
    setIngredients(
      ingredients.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      })
    )
  }

  function handleSubmit() {
    const validIngredients = ingredients.filter(i => i.name.trim() !== '')
    onConfirm(validIngredients)
  }

  return (
    <section className="bg-surface border border-border p-6 md:p-8 rounded-2xl text-center animate-fade-in max-w-xl mx-auto shadow-md">
      {/* Icon header yang dipoles lebih modern */}
      <div className="w-12 h-12 bg-ink/5 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-2xl">🔍</span>
      </div>
      
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
        Konfirmasi Bahan Makanan
      </h2>
      <p className="text-xs md:text-sm text-ink/60 mb-6 max-w-sm mx-auto leading-relaxed">
        Berikut bahan yang terdeteksi. Silakan sesuaikan takaran atau tambahkan bahan cadangan lainnya.
      </p>

      {/* --- LIST BAHAN YANG SUDAH TERDAFTAR --- */}
      <div className="flex flex-col gap-2.5 mb-6 text-left">
        {ingredients.length === 0 ? (
          <div className="text-center py-8 text-xs text-ink/40 border border-dashed border-border rounded-xl bg-paper/50">
            📌 Belum ada bahan terdaftar. Yuk, tambahkan bahan di bawah!
          </div>
        ) : (
          ingredients.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-3 bg-paper p-3 rounded-xl border border-border/80 hover:border-ink/15 transition duration-150 shadow-sm"
            >
              {/* Nama Bahan */}
              <input
                type="text"
                value={item.name}
                placeholder="Nama bahan..."
                onChange={(e) => handleUpdateIngredient(item.id, 'name', e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-b border-transparent focus:border-ink/20 py-0.5 focus:outline-none text-sm font-semibold capitalize text-ink"
              />

              {/* Input Jumlah & Satuan dengan Desain Kompak */}
              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={item.quantity}
                  onChange={(e) => handleUpdateIngredient(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-12 text-center bg-surface border border-border rounded-lg py-1 text-xs font-bold focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10"
                />

                <select
                  value={item.unit}
                  onChange={(e) => handleUpdateIngredient(item.id, 'unit', e.target.value)}
                  className="bg-surface border border-border rounded-lg py-1 px-2 text-xs font-semibold focus:outline-none focus:border-ink cursor-pointer text-ink/80 hover:bg-border/10 transition"
                >
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tombol Hapus minimalis */}
              <button
                onClick={() => handleRemoveIngredient(item.id)}
                className="p-1.5 hover:bg-tomato/10 rounded-lg text-tomato/50 hover:text-tomato transition-colors duration-200"
                title="Hapus bahan"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- FORM BARU: TAMBAH BAHAN DENGAN AKSEN BG --- */}
      <div className="bg-paper/40 border border-border p-4 rounded-xl text-left mb-8 shadow-inner">
        <label className="text-[10px] font-bold text-ink/40 uppercase tracking-wider block mb-2">
          Tambah Bahan Tambahan
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Input Nama */}
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Misal: Bawang putih..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-surface focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/10 font-medium"
          />

          <div className="flex gap-2">
            {/* Input Jumlah */}
            <input
              type="number"
              min="0.1"
              step="any"
              value={newItemQty}
              onChange={(e) => setNewItemQty(parseFloat(e.target.value) || 0)}
              className="w-14 text-center text-sm rounded-lg border border-border bg-surface focus:outline-none focus:border-ink font-bold"
            />

            {/* Pilihan Satuan */}
            <select
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="px-2 py-2 text-xs rounded-lg border border-border bg-surface focus:outline-none focus:border-ink font-semibold cursor-pointer"
            >
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>

            {/* Tombol Tambah */}
            <button
              onClick={handleAddIngredient}
              className="px-4 py-2 bg-ink text-paper rounded-lg text-xs font-semibold hover:opacity-90 transition whitespace-nowrap active:scale-95"
            >
              + Tambah
            </button>
          </div>
        </div>
      </div>

      {/* --- NAVIGASI STEPPER (FOOTER) --- */}
      <div className="flex gap-3 justify-center border-t border-border/40 pt-6">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-ink/5 transition active:scale-95 text-ink/70"
        >
          Kembali
        </button>
        <button
          onClick={handleSubmit}
          disabled={ingredients.length === 0}
          className="px-6 py-2.5 rounded-full bg-ink text-paper text-sm font-semibold hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md shadow-ink/10 active:scale-95"
        >
          Lanjut Cari Resep
        </button>
      </div>
    </section>
  )
}