'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, Info, Star } from 'lucide-react'
import { BACKDROP, titleOf, inferType } from '@/lib/tmdb'

export default function Hero({ items = [] }) {
  const [idx, setIdx] = useState(0)
  const picks = items.filter(i => i?.backdrop_path).slice(0, 6)

  useEffect(() => {
    if (!picks.length) return
    const t = setInterval(() => setIdx(i => (i + 1) % picks.length), 7000)
    return () => clearInterval(t)
  }, [picks.length])

  if (!picks.length) return <div className="h-[70vh] bg-gradient-to-br from-black via-neutral-900 to-black" />

  const item = picks[idx]
  const type = inferType(item)
  const title = titleOf(item)

  return (
    <section className="relative h-[85vh] min-h-[520px] w-full overflow-hidden">
      {picks.map((p, i) => (
        <div key={p.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}>
          <img src={BACKDROP(p.backdrop_path, 'original')} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 hero-gradient" />
      <div className="relative z-10 h-full flex items-end md:items-center pb-16 md:pb-0">
        <div className="px-4 md:px-8 max-w-3xl mt-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Featured</span>
            <span className="text-xs uppercase tracking-widest text-white/60">• {type === 'tv' ? 'Series' : 'Movie'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] drop-shadow-2xl">{title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-white/80">
            {item?.vote_average > 0 && (
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {item.vote_average.toFixed(1)}</span>
            )}
            {(item?.release_date || item?.first_air_date) && (
              <span>{new Date(item.release_date || item.first_air_date).getFullYear()}</span>
            )}
            <span className="uppercase text-[11px] font-semibold px-2 py-0.5 rounded bg-white/10 border border-white/10">HD</span>
          </div>
          {item?.overview && <p className="mt-4 text-sm md:text-base text-white/85 line-clamp-3 max-w-2xl">{item.overview}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href={`/watch/${type}/${item.id}`} className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary/30">
              <Play className="h-5 w-5 fill-primary-foreground" /> Watch Now
            </Link>
            <Link href={`/details/${type}/${item.id}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/10 transition-all">
              <Info className="h-5 w-5" /> More Info
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-2">
            {picks.map((_, i) => (
              <button key={i} onClick={()=>setIdx(i)} aria-label={`slide ${i+1}`} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-10 bg-primary' : 'w-4 bg-white/30 hover:bg-white/60'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
