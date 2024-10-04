import './globals.css'
import { Raleway } from 'next/font/google' // Changed from Inter to Raleway
import { AuthProvider } from '../contexts/AuthContext'
import Layout from '@/components/Layout'

const raleway = Raleway({ subsets: ['latin'] }) // Updated to use Raleway

export const metadata = {
  title: 'LoopFeed',
  description: 'Connect with mentors and mentees',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={raleway.className}> {/* Updated to use raleway */}
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}
