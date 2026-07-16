import { useRef, useState } from 'react'
import { api } from '../api'

export default function UploadPhoto({ onDetected }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setResult(null)
    setPreview(URL.createObjectURL(file))
    setLoading(true)
    try {
      const data = await api.detectFood(file)
      setResult(data)
      onDetected?.(data.food_name)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto text-center py-10">
      <p className="uppercase tracking-[0.2em] text-xs text-ink/50 mb-3">
        Langkah 1 dari 3
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-3">
        Apa yang ada di kulkasmu hari ini?
      </h1>
      <p className="text-ink/60 mb-8 max-w-lg mx-auto">
        Foto atau unggah bahan makananmu, biar LetUsCook! yang cari tahu mau masak apa.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        className={`relative rounded-card border-2 border-dashed transition-colors ${
          dragOver ? 'border-yolk bg-yolk/10' : 'border-border bg-surface'
        } p-10 flex flex-col items-center gap-4`}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview bahan makanan"
            className="w-40 h-40 object-cover rounded-2xl border border-border"
          />
        ) : (
          <div className="w-40 h-40 rounded-2xl border border-border bg-paper flex items-center justify-center text-5xl">
            🥘
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-full bg-ink text-paper text-sm font-medium hover:opacity-90 transition"
          >
            Pilih foto
          </button>
          <label className="px-5 py-2.5 rounded-full border border-border bg-surface text-sm font-medium cursor-pointer hover:border-ink/40 transition">
            Ambil foto
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <p className="text-xs text-ink/40">atau seret gambar ke sini</p>
      </div>

      {loading && (
        <p className="mt-5 text-sm text-ink/60 animate-pulse">Mendeteksi bahan makanan...</p>
      )}

      {error && (
        <p className="mt-5 text-sm text-tomato">{error}</p>
      )}

      {result && !loading && (
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 border border-sage/30">
          <span className="text-sm text-ink/70">Terdeteksi:</span>
          <span className="font-semibold capitalize">{result.food_name}</span>
          {result.mocked && (
            <span className="text-xs text-ink/40">(mode demo, tanpa API key)</span>
          )}
        </div>
      )}
    </section>
  )
}
