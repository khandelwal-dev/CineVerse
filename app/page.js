'use client'
import { useEffect, useState } from 'react'
import Hero from '@/components/site/Hero'
import Row from '@/components/site/Row'
import SkeletonRow from '@/components/site/SkeletonRow'
import { AlertCircle } from 'lucide-react'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/home')
        const json = await res.json()
        if (cancelled) return
        if (json.error) setError(json.error)
        setData(json)
      } catch (e) {
        setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (error && (!data || !data.trending?.length)) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white/5 border border-white/10 rounded-2xl p-8">
          <AlertCircle className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Setup Required</h2>
          <p className="text-sm text-white/70 mb-4">Add your <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">TMDB_API_KEY</span> to <span className="font-mono">/app/.env</span> and restart the server.</p>
          <p className="text-xs text-white/40">Grab a free key: <a className="text-primary hover:underline" href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">themoviedb.org/settings/api</a></p>
          <p className="mt-4 text-[10px] text-white/30 break-all">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {loading ? (
        <div className="h-[85vh] min-h-[520px] w-full skeleton" />
      ) : (
        <Hero items={data?.trending || []} />
      )}
      <div className="pb-16">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            <Row title="🔥 Trending This Week" items={data?.trending || []} viewMoreHref="/browse/trending" />
            <Row title="🎬 Popular Movies" items={data?.popular_movies || []} forceType="movie" viewMoreHref="/browse/movies" />
            <Row title="📺 Popular TV Series" items={data?.popular_tv || []} forceType="tv" viewMoreHref="/browse/tv" />
            <Row title="🌸 Top Anime" items={data?.anime || []} forceType="tv" viewMoreHref="/browse/anime" />
            <Row title="💜 Best K-Dramas" items={data?.kdrama || []} forceType="tv" viewMoreHref="/browse/kdrama" />
            <Row title="🏆 Top Rated Movies" items={data?.top_movies || []} forceType="movie" viewMoreHref="/browse/top-movies" />
            <Row title="⭐ Top Rated TV" items={data?.top_tv || []} forceType="tv" viewMoreHref="/browse/top-tv" />
            <Row title="🎟️ Upcoming" items={data?.upcoming || []} forceType="movie" viewMoreHref="/browse/upcoming" />
          </>
        )}
      </div>
    </div>
  )
}

export default App
