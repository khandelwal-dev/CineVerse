'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'

export default function Row({ title, items = [], forceType, viewMoreHref }) {
  const ref = useRef(null)
  const scroll = (dir) => {
    if (!ref.current) return
    const w = ref.current.clientWidth
    ref.current.scrollBy({ left: dir * w * 0.9, behavior: 'smooth' })
  }
  if (!items?.length) return null
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-3 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
        {viewMoreHref && <a href={viewMoreHref} className="text-sm text-primary hover:underline">View all →</a>}
      </div>
      <div className="relative group">
        <button onClick={()=>scroll(-1)} className="absolute left-0 top-0 bottom-16 z-10 w-12 md:w-16 flex items-center justify-center bg-gradient-to-r from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft className="h-8 w-8 text-white drop-shadow" />
        </button>
        <button onClick={()=>scroll(1)} className="absolute right-0 top-0 bottom-16 z-10 w-12 md:w-16 flex items-center justify-center bg-gradient-to-l from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-8 w-8 text-white drop-shadow" />
        </button>
        <div ref={ref} className="row-scroll flex gap-3 md:gap-4 overflow-x-auto scroll-smooth px-4 md:px-8 pb-4">
          {items.map((it) => (
            <MovieCard key={`${it.id}-${it.media_type||forceType||'x'}`} item={it} forceType={forceType} />
          ))}
        </div>
      </div>
    </section>
  )
}
