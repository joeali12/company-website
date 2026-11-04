/** Illustrative visual only — not a product screenshot. */
export function EducorePreview() {
  return (
    <figure className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-950/70 p-4 sm:p-5">
      <figcaption className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-muted">
        Illustrative product preview
      </figcaption>

      <div
        aria-hidden="true"
        className="relative aspect-[5/4] overflow-hidden rounded-xl border border-cyan-400/15 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_45%),linear-gradient(160deg,#0f172a,#060b16)] p-4"
      >
        <div className="absolute inset-x-6 top-5 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="mt-4 grid h-full grid-rows-[auto_1fr] gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/80" />
            <span className="h-2 w-24 rounded-full bg-white/15" />
            <span className="ml-auto h-2 w-10 rounded-full bg-white/10" />
          </div>

          <div className="grid grid-cols-[0.9fr_1.1fr] gap-3">
            <div className="flex flex-col gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <span className="h-2 w-16 rounded-full bg-cyan-300/40" />
              <span className="h-2 w-full rounded-full bg-white/10" />
              <span className="h-2 w-[80%] rounded-full bg-white/10" />
              <span className="mt-auto h-8 rounded-lg border border-cyan-400/20 bg-cyan-400/10" />
            </div>

            <div className="relative rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-500/25 text-[0.65rem] text-cyan-200">
                  A
                </span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-cyan-400/20 text-[0.65rem] text-cyan-100">
                  B
                </span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[0.65rem] text-slate-soft">
                  C
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-8 rounded-lg bg-white/[0.06]" />
                <div className="h-8 rounded-lg bg-white/[0.04]" />
                <div className="h-8 w-[70%] rounded-lg bg-cyan-400/10" />
              </div>
              <svg
                className="absolute -right-1 bottom-2 h-16 w-16 text-cyan-400/25"
                viewBox="0 0 64 64"
                fill="none"
              >
                <circle cx="20" cy="28" r="6" stroke="currentColor" />
                <circle cx="44" cy="22" r="5" stroke="currentColor" />
                <circle cx="38" cy="42" r="7" stroke="currentColor" />
                <path
                  d="M25 30l14-6M25 32l10 8M42 27l-2 10"
                  stroke="currentColor"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}
