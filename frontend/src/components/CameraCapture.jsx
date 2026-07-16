import { useEffect, useRef, useState } from 'react'

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setReady(true)
      } catch (err) {
        setError(
          err.name === 'NotAllowedError'
            ? 'Akses kamera ditolak. Izinkan akses kamera di browser untuk mengambil foto.'
            : 'Tidak bisa membuka kamera di perangkat ini.'
        )
      }
    }

    startCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function handleCapture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
        onCapture(file)
      },
      'image/jpeg',
      0.9
    )
  }

  return (
    <div className="fixed inset-0 z-40 bg-ink/80 flex items-center justify-center p-4">
      <div className="bg-paper w-full max-w-lg rounded-card overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <p className="text-sm font-semibold">Ambil foto bahan makanan</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-ink/40"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="relative bg-black aspect-video flex items-center justify-center">
          {error ? (
            <p className="text-sm text-white/80 text-center px-6">{error}</p>
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="p-4 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-ink/5 transition"
          >
            Batal
          </button>
          <button
            onClick={handleCapture}
            disabled={!ready || !!error}
            className="px-6 py-2.5 rounded-full bg-ink text-paper text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            📸 Cekrek
          </button>
        </div>
      </div>
    </div>
  )
}
