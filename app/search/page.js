'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '@/components/site/MovieCard'
import { Loader2, SearchIcon } from 'lucide-react'
import { Search as SearchLucide } from 'lucide-react'

function SearchInner() {
  const params = useSearchParams()
  const q = params.get('q') || ''
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) { setItems([]); return }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (cancelled) return
      const filtered = (data?.results || []).filter(r => r.media_type === 'movie' || r.media_type === 'tv')
      setItems(filtered)
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [q])

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <SearchLucide className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Search Results</h1>
          {q && <p className="text-white/50 text-sm mt-1">for “<span className="text-white">{q}</span>”</p>}
        </div>
      </div>

      {loading && <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

      {!loading && items.length === 0 && q && (
        <div className="text-center py-24 text-white/50">No results found for “{q}”.</div>
      )}

      {!loading && !q && (
        <div className="text-center py-24 text-white/50">Start typing in the search bar above.</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
        {items.map((it, idx) => <MovieCard key={`${it.id}-${idx}`} item={it} />)}
      </div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<div className="pt-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <SearchInner />
    </Suspense>
  )
}

export default App
