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
  { id: 'vidsrcxyz', label: 'VidSrc.xyz', movie: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`, tv: (id, s, e) => `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}` },
  { id: 'vidsrcto',  label: 'VidSrc.to',  movie: (id) => `https://vidsrc.to/embed/movie/${id}`,     tv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { id: 'vidsrccc',  label: 'VidSrc.cc',  movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,  tv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` },
  { id: '2embed',    label: '2Embed',     movie: (id) => `https://www.2embed.cc/embed/${id}`,       tv: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` },
  { id: 'superembed',label: 'SuperEmbed', movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`, tv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` },
]
