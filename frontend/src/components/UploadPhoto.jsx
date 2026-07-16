import { useRef, useState, useEffect } from 'react'
import { api } from '../api'

const STABLE_LOADING_STEPS = [
  "Sedang menghubungkan ke inti AI...",
  "Menganalisis komposisi warna...",
  "Mencari kontur objek...",
  "Mencocokkan basis data bahan...",
  "Menyelesaikan analisis final..."
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
        setLoadingStepIndex((prev) => (prev + 1) % STABLE_LOADING_STEPS.length)
      }, 900)
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
      await sleep(3500)
      onDetected?.(data.food_name)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-5xl mx-auto py-2 animate-fade-in px-4">
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.08); opacity: 0.25; }
        }
      `}</style>

      {/* CONTAINER UTAMA SIDE-BY-SIDE SEKARANG BERSIH TANPA TOP HEADER */}
      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8">
        
        {/* Area Upload Box */}
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
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 w-full max-w-md ${
            dragOver 
              ? 'border-yolk bg-yolk/5 shadow-lg shadow-yolk/5 scale-[1.01]' 
              : 'border-border bg-surface hover:border-ink/20 shadow-sm'
          } p-8 flex flex-col items-center gap-6 shrink-0 md:justify-center`}
        >
          {preview ? (
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-border/85 shadow-md shrink-0">
              <img src={preview} alt="preview bahan makanan" className="w-full h-full object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col justify-between p-3">
                  <div 
                    className="absolute left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-yolk to-transparent shadow-[0_0_15px_#eab308,0_0_6px_#eab308]"
                    style={{ animation: 'scan 2s ease-in-out infinite', transform: 'translateY(-50%)' }}
                  />
                  <div className="z-10 bg-black/70 rounded-full px-2.5 py-0.5 text-[9px] text-yolk font-bold uppercase tracking-widest mx-auto animate-pulse border border-yolk/20 shadow-lg whitespace-nowrap">
                    Scanning...
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-ink/5 rounded-full" style={{ animation: 'pulse-slow 3s ease-in-out infinite' }} />
              <div className="relative w-20 h-20 rounded-full border border-border bg-paper flex items-center justify-center text-3xl shadow-inner">
                🥘
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto mt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-full bg-ink text-paper text-sm font-semibold hover:opacity-95 shadow-md shadow-ink/10 transition-all active:scale-95 whitespace-nowrap"
            >
              Pilih foto
            </button>
            
            <label className="px-5 py-2.5 rounded-full border border-border bg-surface text-sm font-semibold cursor-pointer hover:bg-paper hover:border-ink/30 transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ink/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ambil foto
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          <p className="text-xs text-ink/40 font-medium text-center">atau seret & letakkan gambar ke sini</p>
        
          {error && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-tomato/5 border border-tomato/20 rounded-lg text-xs text-tomato max-w-full">
              <span className="font-bold shrink-0">⚠</span> 
              <span className="block truncate">{error}</span>
            </div>
          )}
        </div>

        {/* Area Status Loading */}
        {loading && (
          <div className="flex-1 w-full max-w-md md:max-w-none animate-fade-in flex flex-col">
            <div className="flex flex-col items-center md:items-start justify-center h-full gap-4 bg-border/20 p-6 md:p-8 rounded-2xl border border-border/10 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-yolk/20 border-t-yolk rounded-full animate-spin shrink-0" />
                <p className="text-xs text-ink/70 font-semibold tracking-wide uppercase whitespace-nowrap">
                  Proses AI Aktif
                </p>
              </div>
              
              <div className="w-full h-px bg-border/50 md:block hidden" />
              
              <div className="w-full flex items-center justify-center md:justify-start min-h-[4rem] md:min-h-[5rem]">
                <p className="text-base md:text-xl text-ink/90 font-semibold transition-all duration-300 text-center md:text-left leading-tight bg-gradient-to-r from-ink/90 to-ink/70 bg-clip-text text-transparent animate-pulse">
                  {STABLE_LOADING_STEPS[loadingStepIndex]}
                </p>
              </div>
              
              <p className="text-xs text-ink/50 md:block hidden">
                Mohon tunggu sebentar, kami sedang mengidentifikasi bahan makanan Anda untuk meracik resep terbaik.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}