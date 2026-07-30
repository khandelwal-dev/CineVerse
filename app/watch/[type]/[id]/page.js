'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { IMG, titleOf } from '@/lib/tmdb'
import { STREAM_PROVIDERS } from '@/lib/tmdb'
import { ArrowLeft, Loader2, Server, Play } from 'lucide-react'

function App({ params }) {
  const { type, id } = use(params)
  const [detail, setDetail] = useState(null)
  const [seasonNum, setSeasonNum] = useState(1)
  const [episodeNum, setEpisodeNum] = useState(1)
  const [seasonData, setSeasonData] = useState(null)
  const [providerIdx, setProviderIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingSeason, setLoadingSeason] = useState(false)

  const provider = STREAM_PROVIDERS[providerIdx]

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const res = await fetch(`/api/detail/${type}/${id}`)
      const json = await res.json()
      if (cancelled) return
      setDetail(json)
      if (type === 'tv' && json?.seasons?.length) {
        // pick first non-zero season by default
        const first = json.seasons.find(s => s.season_number > 0) || json.seasons[0]
        setSeasonNum(first.season_number)
      }
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [type, id])

  useEffect(() => {
    if (type !== 'tv' || !id) return
    let cancelled = false
    ;(async () => {
      setLoadingSeason(true)
      const res = await fetch(`/api/season/${id}/${seasonNum}`)
      const json = await res.json()
      if (cancelled) return
      setSeasonData(json)
      setEpisodeNum(1)
      setLoadingSeason(false)
    })()
    return () => { cancelled = true }
  }, [type, id, seasonNum])

  if (loading) return (
    <div className="pt-24 min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
  )
  if (!detail || detail.error) return (
    <div className="pt-24 min-h-screen flex items-center justify-center text-white/60">Not found.</div>
  )

  const embedUrl = type === 'movie' ? provider.movie(id) : provider.tv(id, seasonNum, episodeNum)
  const title = titleOf(detail)

  return (
    <div className="pt-20 pb-16">
      <div className="px-4 md:px-8 max-w-[1600px] mx-auto">
        <Link href={`/details/${type}/${id}`} className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to details
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Player */}
          <div className="flex-1 min-w-0">
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <iframe
                key={embedUrl}
                src={embedUrl}
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                referrerPolicy="no-referrer"
                className="w-full h-full"
              />
            </div>

            <div className="mt-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
              {type === 'tv' && seasonData?.episodes?.[episodeNum-1] && (
                <p className="text-white/60 text-sm mt-1">S{seasonNum} · E{episodeNum} — {seasonData.episodes[episodeNum-1]?.name}</p>
              )}
            </div>

            {/* Server switcher */}
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-sm text-white/70"><Server className="h-4 w-4" /> If the video doesn't play, switch server:</div>
              <div className="flex flex-wrap gap-2">
                {STREAM_PROVIDERS.map((p, i) => (
                  <button key={p.id} onClick={()=>setProviderIdx(i)} className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${i === providerIdx ? 'bg-primary border-primary text-primary-foreground' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'}`}>Server {i+1} · {p.label}</button>
                ))}
              </div>
            </div>

            {detail?.overview && (
              <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-sm font-semibold text-white/80 mb-1">Overview</div>
                <p className="text-sm text-white/70 leading-relaxed">{detail.overview}</p>
              </div>
            )}
          </div>

          {/* Episode sidebar */}
          {type === 'tv' && (
            <aside className="w-full lg:w-96 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm text-white/70">Season</label>
                  <select value={seasonNum} onChange={(e)=>setSeasonNum(Number(e.target.value))} className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                    {detail.seasons?.filter(s => s.season_number >= 0).map(s => (
                      <option key={s.id} value={s.season_number}>{s.name} ({s.episode_count} eps)</option>
                    ))}
                  </select>
                </div>
                <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-2">
                  {loadingSeason && <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
                  {!loadingSeason && seasonData?.episodes?.map(ep => (
                    <button key={ep.id} onClick={()=>setEpisodeNum(ep.episode_number)} className={`w-full text-left flex gap-3 p-2 rounded-lg transition-colors ${ep.episode_number === episodeNum ? 'bg-primary/20 ring-1 ring-primary/50' : 'hover:bg-white/5'}`}>
                      <div className="relative w-32 aspect-video rounded-md overflow-hidden bg-black shrink-0">
                        {ep.still_path ? <img src={IMG(ep.still_path, 'w300')} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[10px] text-white/40">No image</div>}
                        {ep.episode_number === episodeNum && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Play className="h-6 w-6 fill-white text-white" /></div>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-white/50">EP {ep.episode_number}</div>
                        <div className="text-sm font-medium line-clamp-2">{ep.name}</div>
                        <div className="text-[11px] text-white/40 mt-0.5">{ep.air_date || ''}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
