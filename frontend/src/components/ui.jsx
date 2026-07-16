export function Badge({ children, tone = "daun" }) {
  const tones = {
    daun: "bg-daun/10 text-daun-dark border-daun/20",
    kunyit: "bg-kunyit/15 text-kunyit-dark border-kunyit/30",
    cabai: "bg-cabai/10 text-cabai-dark border-cabai/25",
    ink: "bg-ink/5 text-ink border-ink/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

const FLAME_COUNT = {
  // English (sesuai dummy recipe)
  Easy: 1,
  Medium: 2,
  Hard: 3,

  // Indonesia (kalau nanti dipakai)
  Mudah: 1,
  Sedang: 2,
  Sulit: 3,
};

export function DifficultyFlames({ difficulty }) {
  const count = FLAME_COUNT[difficulty] || 1;

  return (
    <span
      className="inline-flex items-center gap-1"
      title={`Tingkat kesulitan: ${difficulty}`}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < count ? "opacity-100" : "opacity-20"}>
          🔥
        </span>
      ))}

      <span className="ml-1 text-xs font-semibold text-ink-light">
        {difficulty}
      </span>
    </span>
  );
}

export function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-ink-light">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-daun/20 border-t-daun" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function EmptyState({ icon = "🍽️", title, hint, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ink/15 bg-white/50 px-6 py-14 text-center">
      <div className="text-4xl">{icon}</div>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {hint && <p className="max-w-sm text-sm text-ink-light">{hint}</p>}
      {action}
    </div>
  );
}
