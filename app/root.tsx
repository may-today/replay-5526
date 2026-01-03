import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { Toaster } from '~/components/ui/sonner'
import { TextureOverlay } from '~/components/ui/texture-overlay'

import type { Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://cloud-upyun.ddiu.site/font/SourceHanSerifCN/result.css',
    crossOrigin: 'anonymous',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html data-theme="dark" lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1, user-scalable=no" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body className="relative h-dvh">
        <div className="absolute inset-0 z-0 rounded-lg bg-linear-to-br from-neutral-800 to-neutral-900">
          <TextureOverlay className="mix-blend-overlay" texture="dots" />
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col overflow-hidden border-zinc-800 border-x bg-zinc-950 md:border-x">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
