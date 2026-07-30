import { NextResponse } from 'next/server'

const TMDB_BASE = 'https://api.themoviedb.org/3'

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function tmdbFetch(path, searchParams = {}) {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    return { error: 'TMDB_API_KEY missing. Add it to /app/.env and restart the server.' , status: 500 }
  }
  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('language', 'en-US')
  url.searchParams.set('include_adult', 'false')
  for (const [k, v] of Object.entries(searchParams)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  }
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } })
    if (!res.ok) {
      const text = await res.text()
      return { error: `TMDB error ${res.status}: ${text}`, status: res.status }
    }
    return { data: await res.json() }
  } catch (e) {
    return { error: e.message, status: 500 }
  }
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const url = new URL(request.url)
  const q = Object.fromEntries(url.searchParams.entries())

  try {
    // Health check
    if (route === '/' || route === '/root') {
      return handleCORS(NextResponse.json({ message: 'CineVerse API online', hasKey: !!process.env.TMDB_API_KEY }))
    }

    // /api/tmdb/*  — generic passthrough (path after /tmdb is forwarded to TMDB)
    if (route.startsWith('/tmdb/')) {
      const tmdbPath = route.replace(/^\/tmdb/, '') // e.g. /movie/popular
      const { data, error, status } = await tmdbFetch(tmdbPath, q)
      if (error) return handleCORS(NextResponse.json({ error }, { status: status || 500 }))
      return handleCORS(NextResponse.json(data))
    }

    // Preset endpoints for the home page — batch style
    if (route === '/home') {
      const [trending, popMovies, topMovies, popTV, topTV, anime, kdrama, upcoming] = await Promise.all([
        tmdbFetch('/trending/all/week', { page: 1 }),
        tmdbFetch('/movie/popular', { page: 1 }),
        tmdbFetch('/movie/top_rated', { page: 1 }),
        tmdbFetch('/tv/popular', { page: 1 }),
        tmdbFetch('/tv/top_rated', { page: 1 }),
        tmdbFetch('/discover/tv', { with_genres: 16, with_original_language: 'ja', sort_by: 'popularity.desc', page: 1 }),
        tmdbFetch('/discover/tv', { with_original_language: 'ko', sort_by: 'popularity.desc', page: 1 }),
        tmdbFetch('/movie/upcoming', { page: 1 }),
      ])
      return handleCORS(NextResponse.json({
        trending: trending.data?.results || [],
        popular_movies: popMovies.data?.results || [],
        top_movies: topMovies.data?.results || [],
        popular_tv: popTV.data?.results || [],
        top_tv: topTV.data?.results || [],
        anime: anime.data?.results || [],
        kdrama: kdrama.data?.results || [],
        upcoming: upcoming.data?.results || [],
        error: trending.error || popMovies.error || null,
      }))
    }

    // /api/browse/:category?page=N
    if (route.startsWith('/browse/')) {
      const category = route.split('/')[2]
      const page = q.page || 1
      let path = ''
      let extra = { page }
      switch (category) {
        case 'movies': path = '/movie/popular'; break
        case 'top-movies': path = '/movie/top_rated'; break
        case 'now-playing': path = '/movie/now_playing'; break
        case 'upcoming': path = '/movie/upcoming'; break
        case 'tv': path = '/tv/popular'; break
        case 'top-tv': path = '/tv/top_rated'; break
        case 'on-air': path = '/tv/on_the_air'; break
        case 'anime':
          path = '/discover/tv'
          extra = { ...extra, with_genres: 16, with_original_language: 'ja', sort_by: 'popularity.desc' }
          break
        case 'anime-movies':
          path = '/discover/movie'
          extra = { ...extra, with_genres: 16, with_original_language: 'ja', sort_by: 'popularity.desc' }
          break
        case 'kdrama':
          path = '/discover/tv'
          extra = { ...extra, with_original_language: 'ko', sort_by: 'popularity.desc' }
          break
        case 'trending':
          path = '/trending/all/week'
          break
        default:
          return handleCORS(NextResponse.json({ error: 'Unknown category' }, { status: 404 }))
      }
      const { data, error, status } = await tmdbFetch(path, extra)
      if (error) return handleCORS(NextResponse.json({ error }, { status: status || 500 }))
      return handleCORS(NextResponse.json(data))
    }

    // /api/detail/:type/:id
    if (route.startsWith('/detail/')) {
      const parts = route.split('/')
      const type = parts[2]
      const id = parts[3]
      if (!['movie', 'tv'].includes(type)) return handleCORS(NextResponse.json({ error: 'invalid type' }, { status: 400 }))
      const { data, error, status } = await tmdbFetch(`/${type}/${id}`, {
        append_to_response: 'credits,videos,recommendations,similar,external_ids,images',
      })
      if (error) return handleCORS(NextResponse.json({ error }, { status: status || 500 }))
      return handleCORS(NextResponse.json(data))
    }

    // /api/season/:tvId/:seasonNumber
    if (route.startsWith('/season/')) {
      const parts = route.split('/')
      const tvId = parts[2]
      const seasonNum = parts[3]
      const { data, error, status } = await tmdbFetch(`/tv/${tvId}/season/${seasonNum}`)
      if (error) return handleCORS(NextResponse.json({ error }, { status: status || 500 }))
      return handleCORS(NextResponse.json(data))
    }

    // /api/search?q=&page=
    if (route === '/search') {
      const query = q.q || ''
      if (!query) return handleCORS(NextResponse.json({ results: [] }))
      const { data, error, status } = await tmdbFetch('/search/multi', { query, page: q.page || 1 })
      if (error) return handleCORS(NextResponse.json({ error }, { status: status || 500 }))
      return handleCORS(NextResponse.json(data))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
