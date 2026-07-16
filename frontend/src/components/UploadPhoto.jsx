import { useRef, useState, useEffect } from 'react'
import { api } from '../api'

const LOADING_STEPS = [
  "Menghubungkan ke modul AI LetUsCook...",
  "Menganalisis komposisi warna gambar...",
  "Mencari kontur dan bentuk objek...",
  "Mencocokkan objek dengan basis data bahan makanan...",
  "Menyelesaikan analisis akhir..."
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function UploadPhoto({ onDetected }) {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)

  useEffect(() => {
    let interval
    if (loading) {
      setLoadingStepIndex(0)
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length)
      }, 800)
    }
    return () => clearInterval(interval)
  }, [loading])

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setPreview(URL.createObjectURL(file))
    setLoading(true)
    
    try {
      const data = await api.detectFood(file)
      await sleep(3500) // Tahan loading 3,5 detik agar animasinya memuaskan
      
      onDetected?.(data.food_name) // Begitu selesai, kirim ke App.js untuk memicu Step 2
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto text-center py-4">
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>

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
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-border">
            <img
              src={preview}
              alt="preview bahan makanan"
              className="w-full h-full object-cover"
            />
            
            {loading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col justify-between p-2">
                <div 
                  className="absolute left-0 right-0 h-[3px] bg-yolk shadow-[0_0_12px_#eab308,0_0_4px_#eab308]"
                  style={{ 
                    animation: 'scan 2.5s ease-in-out infinite',
                    transform: 'translateY(-50%)'
                  }}
                />
                <div className="z-10 bg-black/60 rounded-md px-1.5 py-0.5 text-[9px] text-yolk font-semibold uppercase tracking-wider mx-auto animate-pulse">
                  Scanning...
                </div>
              </div>
            )}
          </div>
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
        <div className="mt-5 flex flex-col items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-yolk/30 border-t-yolk rounded-full animate-spin" />
          <p className="text-sm text-ink/60 font-medium animate-pulse transition-all duration-300">
            {LOADING_STEPS[loadingStepIndex]}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-5 text-sm text-tomato">{error}</p>
      )}
    </section>
  )
}