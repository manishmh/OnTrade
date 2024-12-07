import RainbowProvider from '@/rainbow-provider'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'RealTrade',
  description: 'Trade Stocks On-Chain',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <RainbowProvider>
          {children}
        </RainbowProvider>
        </body>
    </html>
  )
}
