'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Menu, X, Film, Tv, Sparkles, Popcorn } from 'lucide-react'
import { useEffect, useState } from 'react'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/browse/movies', label: 'Movies' },
  { href: '/browse/tv', label: 'TV Series' },
  { href: '/browse/anime', label: 'Anime' },
  { href: '/browse/kdrama', label: 'K-Drama' },
  { href: '/browse/trending', label: 'Trending' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onSearch = (e) => {
    e.preventDefault()
    const query = q.trim()
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/85 backdrop-blur-xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Popcorn className="h-7 w-7 text-primary" />
          <span className="text-xl md:text-2xl font-black tracking-tight brand-glow"><span className="text-primary">Cine</span>Verse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(l => {
            const active = pathname === l.href
            return (
              <Link key={l.href} href={l.href} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>{l.label}</Link>
            )
          })}
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden md:flex items-center bg-white/5 border border-white/10 rounded-full pl-4 pr-1 py-1 w-72 focus-within:ring-2 focus-within:ring-primary/60">
          <Search className="h-4 w-4 text-white/50" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search movies, series, anime…" className="bg-transparent outline-none text-sm text-white placeholder:text-white/40 flex-1 px-3 py-1.5" />
          <button type="submit" className="px-3 py-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold">Go</button>
        </form>

        <button className="md:hidden ml-auto p-2 rounded-md hover:bg-white/5" onClick={()=>setOpen(o=>!o)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-2">
          <form onSubmit={(e)=>{ onSearch(e); setOpen(false) }} className="flex items-center bg-white/5 border border-white/10 rounded-full pl-4 pr-1 py-1">
            <Search className="h-4 w-4 text-white/50" />
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="bg-transparent outline-none text-sm text-white placeholder:text-white/40 flex-1 px-3 py-1.5" />
            <button type="submit" className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Go</button>
          </form>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className={`block px-3 py-2 rounded-md text-sm ${pathname === l.href ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>{l.label}</Link>
          ))}
        </div>
      )}
    </header>
  )
}
