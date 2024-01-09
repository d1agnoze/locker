import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Locker',
  description: 'a Note app that actually useless',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  const canInitSupabaseClient = () => {
    try {
      createClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = canInitSupabaseClient()
  return (
    <html lang="en" className={GeistSans.className} data-theme="dim">
      <body>
        <ToastContainer />
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  )
}
