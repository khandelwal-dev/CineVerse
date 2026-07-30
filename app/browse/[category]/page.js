'use client'
import { useEffect, useState, use } from 'react'
import MovieCard from '@/components/site/MovieCard'
import { Loader2 } from 'lucide-react'

const META = {
  'movies': { title: 'Movies', forceType: 'movie' },
  'top-movies': { title: 'Top Rated Movies', forceType: 'movie' },
  'now-playing': { title: 'Now Playing', forceType: 'movie' },
  'upcoming': { title: 'Upcoming', forceType: 'movie' },
  'tv': { title: 'TV Series', forceType: 'tv' },
  'top-tv': { title: 'Top Rated TV Series', forceType: 'tv' },
  'on-air': { title: 'On The Air', forceType: 'tv' },
  'anime': { title: 'Anime', forceType: 'tv' },
  'anime-movies': { title: 'Anime Movies', forceType: 'movie' },
  'kdrama': { title: 'K-Drama', forceType: 'tv' },
  'trending': { title: 'Trending This Week', forceType: null },
}

function App({ params }) {
  const { category } = use(params)
  const meta = META[category] || { title: category, forceType: null }
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const load = async (p) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/browse/${category}?page=${p}`)
      const data = await res.json()
      const results = data?.results || []
      setItems(prev => p === 1 ? results : [...prev, ...results])
      setHasMore(p < (data?.total_pages || 1) && results.length > 0)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { setPage(1); setItems([]); load(1) /* eslint-disable-next-line */ }, [category])

  const loadMore = () => { const n = page + 1; setPage(n); load(n) }

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{meta.title}</h1>
        <p className="text-white/50 mt-2 text-sm">Discover the best of {meta.title.toLowerCase()}.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
        {items.map((it, idx) => <MovieCard key={`${it.id}-${idx}`} item={it} forceType={meta.forceType} />)}
      </div>

      {loading && (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      )}

      {!loading && hasMore && items.length > 0 && (
        <div className="flex justify-center py-10">
          <button onClick={loadMore} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg shadow-primary/30">Load More</button>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-20 text-white/50">Nothing found. Make sure your TMDB API key is configured.</div>
      )}
    </div>
  )
}

export default App
