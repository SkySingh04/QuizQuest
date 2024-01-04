import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
const poppins = Poppins({ weight: "400" , subsets: ["latin"] , display: "swap" })

export const metadata: Metadata = {
  title: 'QuizQuest',
  description: 'QuizQuest is a quiz app for everyone.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        <Toaster />
        {children}
        <Footer />
        </body>
    </html>
  )
}
