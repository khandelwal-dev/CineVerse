export const IMG = (path, size = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.png'
export const BACKDROP = (path, size = 'original') => path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.png'

export function titleOf(item) {
  return item?.title || item?.name || item?.original_title || item?.original_name || 'Untitled'
}
export function releaseYear(item) {
  const d = item?.release_date || item?.first_air_date
  return d ? new Date(d).getFullYear() : ''
}
export function inferType(item) {
  if (item?.media_type) return item.media_type === 'movie' ? 'movie' : item.media_type === 'tv' ? 'tv' : null
  if (item?.title || item?.release_date) return 'movie'
  return 'tv'
}

export const STREAM_PROVIDERS = [
  { id: 'vidsrcsh', label: 'VidSrc.sh', movie: (id) => `https://vidsrc.sh/embed/movie/${id}`, tv: (id, s, e) => `https://vidsrc.sh/embed/tv/${id}/${s}/${e}` },
  { id: 'watchembed',  label: 'WatchEmbed',  movie: (id) => `https://watch.embed-api.stream/embed/movie/${id}`,     tv: (id, s, e) => `https://watch.embed-api.stream/embed/tv/${id}/${s}/${e}` },
  { id: 'superembed',label: 'SuperEmbed', movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
]
