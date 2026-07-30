import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/site/Navbar'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'CineVerse — Movies, Series, Anime & K-Drama',
  description: 'Stream movies, TV series, anime and K-dramas — all in one place.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-white/5 mt-16 py-10 text-center text-sm text-muted-foreground">
            <p><span className="text-primary font-bold">Cine</span>Verse © {new Date().getFullYear()} — Powered by TMDB. This site does not host any files, it only links to media hosted on 3rd-party providers.</p>
          </footer>
          <Toaster theme="dark" position="top-center" richColors />
        </Providers>
      </body>
    </html>
  )
}
