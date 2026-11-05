import { lazy, Suspense, useCallback, useState } from 'react'

const PlanetScene = lazy(() =>
  import('./hero/PlanetScene').then((module) => ({
    default: module.PlanetScene,
  })),
)

export function Hero() {
  const [webglActive, setWebglActive] = useState(false)
  const handleReady = useCallback(() => setWebglActive(true), [])
  const handleFailed = useCallback(() => setWebglActive(false), [])

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      data-webgl={webglActive ? 'active' : 'fallback'}
      className="hero-section @container relative flex min-h-[100svh] flex-col overflow-x-clip bg-black pt-[var(--header-height)]"
    >
      <div
        aria-hidden="true"
        className="hero-fallback-layer pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[#020308]" />
        <div className="hero-fallback-stars absolute inset-0 opacity-60 [background-image:radial-gradient(1px_1px_at_12%_20%,rgba(230,244,255,0.85),transparent),radial-gradient(1px_1px_at_30%_46%,rgba(170,210,255,0.5),transparent),radial-gradient(1px_1px_at_72%_18%,rgba(230,244,255,0.75),transparent),radial-gradient(1px_1px_at_86%_40%,rgba(103,232,249,0.45),transparent)]" />
        <div className="hero-planet-fallback absolute -left-[18%] top-[18%] h-[140%] w-[150%] rounded-[50%] bg-[radial-gradient(circle_at_62%_28%,rgba(34,211,238,0.55),rgba(8,18,32,0.2)_18%,#05070c_42%,#000_70%)]" />
        <div className="hero-beam absolute right-[6%] top-[8%] h-[70%] w-24 origin-top" />
      </div>

      <Suspense fallback={null}>
        <PlanetScene
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          onReady={handleReady}
          onFailed={handleFailed}
        />
      </Suspense>

      <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-1 flex-col px-5 sm:px-10 lg:px-14">
        <div className="mt-2 flex items-end justify-end border-t border-white/15 pt-3 sm:pt-4">
          <p className="max-w-full text-right text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white/55 sm:text-[0.7rem]">
            ERP · SaaS · Websites · Applications
          </p>
        </div>

        <div className="flex flex-1 items-center py-6 sm:py-8">
          <div>
            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.15rem,6.4cqi,6.35rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-white"
            >
              <span className="block">We build</span>
              <span className="block">
                software that powers{' '}
                <span className="hero-brand">VOLT IQ</span>
              </span>
            </h1>
            <p className="mt-5 max-w-[34rem] font-display text-base font-medium leading-snug tracking-[-0.02em] text-white/75 sm:mt-6 sm:text-lg">
              Digital solutions for people and businesses — ERP systems, SaaS
              products, and websites.
            </p>
          </div>
        </div>

        <div className="border-t border-white/15" />
      </div>
    </section>
  )
}
