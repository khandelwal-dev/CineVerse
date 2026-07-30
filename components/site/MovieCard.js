'use client'
import Link from 'next/link'
import { IMG, titleOf, releaseYear, inferType } from '@/lib/tmdb'
import { Star, Play } from 'lucide-react'

export default function MovieCard({ item, forceType }) {
  const type = forceType || inferType(item)
  const title = titleOf(item)
  const year = releaseYear(item)
  const rating = item?.vote_average ? item.vote_average.toFixed(1) : null
  const poster = item?.poster_path ? IMG(item.poster_path, 'w500') : null

  if (!type || !item?.id) return null

  return (
    <Link href={`/details/${type}/${item.id}`} className="group relative block w-40 sm:w-44 md:w-48 lg:w-52 shrink-0">
      <div className="relative aspect-poster overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-[1.04] group-hover:ring-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/20">
        {poster ? (
          <img src={poster} alt={title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white/30 text-sm p-2 text-center">{title}</div>
        )}
        {rating && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            {rating}
          </div>
        )}
        <div className="absolute top-2 right-2 uppercase text-[10px] font-bold tracking-wider bg-primary/90 text-primary-foreground rounded-md px-1.5 py-0.5">{type}</div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-3">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/60">{year}</div>
              <div className="text-sm font-semibold line-clamp-2">{title}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0"><Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" /></div>
          </div>
        </div>
      </div>
      <div className="mt-2 px-1">
        <div className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{title}</div>
        <div className="text-xs text-white/50">{year}</div>
      </div>
    </Link>
  )
}
