import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

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
    <html lang="zh-Hans">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1, user-scalable=no" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="mx-auto flex h-dvh max-w-3xl flex-col overflow-hidden border-zinc-800 border-x bg-zinc-950 md:border-x">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
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
