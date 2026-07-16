import { useState } from 'react'

const UNIT_OPTIONS = ['pcs', 'gram', 'kg', 'ml', 'liter', 'sdm', 'siung', 'butir']

export default function ConfirmIngredients({ initialFood, onBack, onConfirm }) {
  // Mengubah input deteksi awal menjadi objek di dalam array
  const [ingredients, setIngredients] = useState([
    { id: 1, name: initialFood || '', quantity: 1, unit: 'pcs' }
  ])

  // State untuk Form Input Bahan Baru
  const [newItemName, setNewItemName] = useState('')
  const [newItemQty, setNewItemQty] = useState(1)
  const [newItemUnit, setNewItemUnit] = useState('pcs')

  // Menambah bahan baru secara manual lengkap dengan Jumlah & Satuan yang dipilih
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

    // Reset form input ke nilai awal
    setNewItemName('')
    setNewItemQty(1)
    setNewItemUnit('pcs')
  }

  // Menghapus bahan dari daftar
  function handleRemoveIngredient(id) {
    setIngredients(ingredients.filter((item) => item.id !== id))
  }

  // Mengubah isi properti spesifik dari bahan yang sudah terdaftar (inline editing)
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

  // Mengirim data final kembali ke App.jsx saat tombol diklik
  function handleSubmit() {
    const validIngredients = ingredients.filter(i => i.name.trim() !== '')
    onConfirm(validIngredients)
  }

  return (
    <section className="bg-surface border border-border p-6 md:p-8 rounded-card text-center animate-fade-in max-w-xl mx-auto shadow-sm">
      <span className="text-4xl">🔎</span>
      <h2 className="font-display text-2xl font-semibold mt-3 mb-1">
        Konfirmasi Bahan Makanan
      </h2>
      <p className="text-sm text-ink/60 mb-6">
        Berikut adalah bahan yang terdeteksi. Kamu bisa menambah, mengubah, atau menghapus daftarnya sebelum mencari resep.
      </p>

      {/* --- LIST BAHAN YANG SUDAH TERDAFTAR --- */}
      <div className="flex flex-col gap-3 mb-6 text-left">
        {ingredients.length === 0 ? (
          <p className="text-center py-6 text-xs text-ink/40 border border-dashed border-border rounded-xl">
            Belum ada bahan. Tambahkan bahan makananamu di bawah!
          </p>
        ) : (
          ingredients.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-2 bg-paper p-3 rounded-xl border border-border/80"
            >
              {/* Nama Bahan */}
              <input
                type="text"
                value={item.name}
                placeholder="Nama bahan..."
                onChange={(e) => handleUpdateIngredient(item.id, 'name', e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-b border-transparent focus:border-ink/20 py-0.5 focus:outline-none text-sm font-medium capitalize"
              />

              {/* Jumlah (Quantity) */}
              <input
                type="number"
                min="0.1"
                step="any"
                value={item.quantity}
                onChange={(e) => handleUpdateIngredient(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                className="w-14 text-center bg-surface border border-border rounded-lg py-1 text-xs font-semibold focus:outline-none focus:border-ink"
              />

              {/* Satuan (Unit Dropdown) */}
              <select
                value={item.unit}
                onChange={(e) => handleUpdateIngredient(item.id, 'unit', e.target.value)}
                className="bg-surface border border-border rounded-lg py-1 px-1.5 text-xs font-medium focus:outline-none focus:border-ink cursor-pointer"
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>

              {/* Tombol Hapus */}
              <button
                onClick={() => handleRemoveIngredient(item.id)}
                className="p-1.5 hover:bg-tomato/10 rounded-lg text-tomato/70 hover:text-tomato transition"
                title="Hapus bahan"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- FORM BARU: TAMBAH BAHAN DENGAN JUMLAH & SATUAN --- */}
      <div className="bg-paper border border-border p-4 rounded-xl text-left mb-8">
        <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider block mb-2">
          Tambah Bahan Manual
        </label>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Input Nama */}
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nama bahan (misal: Wortel)..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
            className="flex-1 px-4 py-2 text-sm rounded-lg border border-border bg-surface focus:outline-none focus:border-ink"
          />

          <div className="flex gap-2">
            {/* Input Jumlah */}
            <input
              type="number"
              min="0.1"
              step="any"
              value={newItemQty}
              onChange={(e) => setNewItemQty(parseFloat(e.target.value) || 0)}
              className="w-16 text-center text-sm rounded-lg border border-border bg-surface focus:outline-none focus:border-ink font-semibold"
            />

            {/* Pilihan Satuan */}
            <select
              value={newItemUnit}
              onChange={(e) => setNewItemUnit(e.target.value)}
              className="px-2 py-2 text-xs rounded-lg border border-border bg-surface focus:outline-none focus:border-ink font-medium cursor-pointer"
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
              className="px-4 py-2 bg-ink text-paper rounded-lg text-sm font-semibold hover:opacity-90 transition whitespace-nowrap"
            >
              + Tambah
            </button>
          </div>
        </div>
      </div>

      {/* --- NAVIGASI STEPPER --- */}
      <div className="flex gap-3 justify-center border-t border-border/60 pt-6">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-ink/5 transition"
        >
          Kembali
        </button>
        <button
          onClick={handleSubmit}
          disabled={ingredients.length === 0}
          className="px-6 py-2.5 rounded-full bg-ink text-paper text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Lanjut Cari Resep
        </button>
      </div>
    </section>
  )
}