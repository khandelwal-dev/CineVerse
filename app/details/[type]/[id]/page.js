'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { BACKDROP, IMG, titleOf, releaseYear } from '@/lib/tmdb'
import { Play, Star, Calendar, Clock, Loader2, Youtube } from 'lucide-react'
import Row from '@/components/site/Row'

function App({ params }) {
  const { type, id } = use(params)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/detail/${type}/${id}`)
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch {}
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [type, id])

  if (loading) return (
    <div className="pt-24 min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
  )
  if (!data || data.error) return (
    <div className="pt-24 min-h-screen flex items-center justify-center text-white/60">Not found.</div>
  )

  const title = titleOf(data)
  const year = releaseYear(data)
  const trailer = data?.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') || data?.videos?.results?.find(v => v.site === 'YouTube')
  const runtime = data?.runtime || data?.episode_run_time?.[0]

  return (
    <div>
      {/* Backdrop hero */}
      <div className="relative w-full h-[70vh] min-h-[480px]">
        <img src={BACKDROP(data.backdrop_path, 'original')} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

        <div className="relative z-10 h-full flex items-end pb-10">
          <div className="px-4 md:px-8 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-end">
            {data.poster_path && (
              <img src={IMG(data.poster_path, 'w500')} alt="" className="hidden md:block w-56 lg:w-64 rounded-xl shadow-2xl border border-white/10" />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-2xl">{title}</h1>
              {data.tagline && <p className="italic text-white/70 mt-2">{data.tagline}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/85">
                {data.vote_average > 0 && (<span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {data.vote_average.toFixed(1)}</span>)}
                {year && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {year}</span>}
                {runtime && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {runtime} min</span>}
                <span className="uppercase text-[11px] font-semibold px-2 py-0.5 rounded bg-white/10 border border-white/10">HD</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.genres?.map(g => (<span key={g.id} className="text-xs bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">{g.name}</span>))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link href={`/watch/${type}/${id}`} className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-lg shadow-primary/30">
                  <Play className="h-5 w-5 fill-primary-foreground" /> Watch Now
                </Link>
                {trailer && (
                  <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/10">
                    <Youtube className="h-5 w-5" /> Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview + info */}
      <div className="px-4 md:px-8 max-w-[1600px] mx-auto -mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-3">Overview</h2>
          <p className="text-white/80 leading-relaxed">{data.overview || 'No overview available.'}</p>

          {data.credits?.cast?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-3">Top Cast</h2>
              <div className="flex gap-3 overflow-x-auto row-scroll pb-3">
                {data.credits.cast.slice(0, 15).map(c => (
                  <div key={c.cast_id || c.credit_id} className="w-28 shrink-0">
                    <div className="aspect-poster rounded-lg overflow-hidden bg-white/5">
                      {c.profile_path ? <img src={IMG(c.profile_path, 'w185')} alt={c.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-xs text-white/30">No image</div>}
                    </div>
                    <div className="text-sm font-medium mt-2 line-clamp-1">{c.name}</div>
                    <div className="text-xs text-white/50 line-clamp-1">{c.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-5 h-fit">
          <div><div className="text-xs uppercase tracking-widest text-white/40">Status</div><div className="text-sm mt-0.5">{data.status || '—'}</div></div>
          {data.number_of_seasons != null && (<div><div className="text-xs uppercase tracking-widest text-white/40">Seasons</div><div className="text-sm mt-0.5">{data.number_of_seasons} • {data.number_of_episodes} episodes</div></div>)}
          {data.original_language && (<div><div className="text-xs uppercase tracking-widest text-white/40">Language</div><div className="text-sm mt-0.5 uppercase">{data.original_language}</div></div>)}
          {data.production_companies?.length > 0 && (<div><div className="text-xs uppercase tracking-widest text-white/40">Production</div><div className="text-sm mt-0.5">{data.production_companies.map(p => p.name).join(', ')}</div></div>)}
          {data.homepage && (<a href={data.homepage} target="_blank" rel="noreferrer" className="inline-block text-primary hover:underline text-sm">Official Site →</a>)}
        </aside>
      </div>

      <div className="mt-6">
        {data.recommendations?.results?.length > 0 && (
          <Row title="You May Also Like" items={data.recommendations.results} />
        )}
        {data.similar?.results?.length > 0 && (
          <Row title="More Like This" items={data.similar.results} />
        )}
      </div>
    </div>
  )
}

export default App
