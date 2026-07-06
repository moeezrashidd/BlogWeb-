import React, { useState, useEffect, useCallback } from 'react'
import { sliderData } from '../Context/data'
import { Link } from "react-router-dom"

const Hero = () => {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const length = sliderData.length

  const goTo = useCallback((index) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 700)
  }, [isAnimating])

  const handleNext = useCallback(() => {
    goTo(current === length - 1 ? 0 : current + 1)
  }, [current, length, goTo])

  const handlePrev = useCallback(() => {
    goTo(current === 0 ? length - 1 : current - 1)
  }, [current, length, goTo])

  useEffect(() => {
    const timer = setInterval(handleNext, 5500)
    return () => clearInterval(timer)
  }, [handleNext])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handlePrev])

  return (
    <section
      aria-label="Featured categories hero slider"
      className="relative w-full overflow-hidden
                 h-[340px] sm:h-[420px] md:h-[62vh] lg:h-[68vh] xl:h-[72vh]"
      style={{ maxHeight: '750px' }}
    >
      {/* ── Slides ── */}
      {sliderData.map((item, index) => (
        <div
          key={index}
          aria-hidden={index !== current}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 10 : 0 }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.img})` }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Content — safe horizontal padding so arrows never overlap on any screen */}
          <div className="relative z-10 h-full flex items-center px-5 sm:px-14 lg:px-20">
            <div className="w-full max-w-lg lg:max-w-2xl">

              {/* Category badge */}
              <span className="inline-block text-[10px] sm:text-xs font-bold tracking-widest uppercase
                               bg-blue-600 text-white px-3 py-1 rounded-full mb-3 sm:mb-4">
                {item.category}
              </span>

              {/* Title */}
              <h1
                className="text-white font-extrabold leading-tight mb-3 sm:mb-4
                           text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
              >
                {item.title}
              </h1>

              {/* Description — hidden on very small screens to save space */}
              <p className="hidden sm:block text-gray-200 text-sm md:text-base lg:text-lg leading-relaxed mb-6
                            line-clamp-2 md:line-clamp-none"
                style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
              >
                {item.desc}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
                <Link
                  to={`/posts/${encodeURIComponent(item.category)}`}
                  className="inline-flex items-center gap-2
                             bg-blue-600 hover:bg-blue-700 text-white font-semibold
                             rounded-xl px-4 py-2 sm:px-6 sm:py-2.5
                             text-xs sm:text-sm md:text-base
                             shadow-lg shadow-blue-900/40
                             transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Explore Posts
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                <Link
                  to="/posts"
                  className="inline-flex items-center gap-2 text-white font-semibold
                             rounded-xl px-4 py-2 sm:px-6 sm:py-2.5
                             text-xs sm:text-sm md:text-base
                             border-2 border-white/40 hover:border-white/80
                             bg-white/10 hover:bg-white/20 backdrop-blur-sm
                             transition-all duration-300"
                >
                  All Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ── Side arrows — desktop only (md+) ── */}
      <button
        aria-label="Previous slide"
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30
                   w-10 h-10 lg:w-12 lg:h-12
                   items-center justify-center
                   rounded-full bg-black/30 hover:bg-black/60
                   border border-white/20 hover:border-white/50
                   text-white backdrop-blur-sm
                   transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        aria-label="Next slide"
        onClick={handleNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30
                   w-10 h-10 lg:w-12 lg:h-12
                   items-center justify-center
                   rounded-full bg-black/30 hover:bg-black/60
                   border border-white/20 hover:border-white/50
                   text-white backdrop-blur-sm
                   transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 lg:w-5 lg:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Bottom control bar (dots + mobile arrows all together) ── */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-3">

        {/* Prev arrow — mobile only */}
        <button
          aria-label="Previous slide"
          onClick={handlePrev}
          className="flex md:hidden items-center justify-center
                     w-7 h-7 rounded-full
                     bg-black/40 hover:bg-black/70 border border-white/30
                     text-white transition-all duration-200 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        {sliderData.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goTo(index)}
            className={`rounded-full transition-all duration-300 border border-white/40
              ${index === current
                ? 'w-6 h-2 sm:w-8 sm:h-2.5 bg-blue-500 border-blue-400'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
          />
        ))}

        {/* Next arrow — mobile only */}
        <button
          aria-label="Next slide"
          onClick={handleNext}
          className="flex md:hidden items-center justify-center
                     w-7 h-7 rounded-full
                     bg-black/40 hover:bg-black/70 border border-white/30
                     text-white transition-all duration-200 active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[3px] bg-white/10">
        <div
          key={current}
          className="h-full bg-blue-500"
          style={{ animation: 'heroProgress 5.5s linear forwards' }}
        />
      </div>

      <style>{`
        @keyframes heroProgress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  )
}

export default Hero
