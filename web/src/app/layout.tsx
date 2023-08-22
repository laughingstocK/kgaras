import './globals.css'
import type { Metadata } from 'next'
import { GlobalContextProvider } from './contexts/file'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GlobalContextProvider>
          {children}
        </ GlobalContextProvider>
      </body>
    </html>
  )
}
