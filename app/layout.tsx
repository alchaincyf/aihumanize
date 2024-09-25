import { Metadata } from 'next'
import { Playfair_Display, Montserrat, Roboto } from 'next/font/google'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Humanize AI Text | AI Text Humanizer Tool',
  description: 'Convert AI-generated text into natural, human-like writing. Bypass AI detection and achieve 100% originality with our advanced AI text humanizer tool.',
  keywords: 'AI text humanizer, AI detection bypass, human-like writing, text conversion',
  openGraph: {
    title: 'Humanize AI Text | AI Text Humanizer Tool',
    description: 'Convert AI-generated text into natural, human-like writing. Bypass AI detection and achieve 100% originality.',
    url: 'https://humanize-ai.top',
    siteName: 'Humanize AI',
    images: [
      {
        url: 'https://humanize-ai.top/og-image.jpg', // 确保创建并上传这个图片
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humanize AI Text | AI Text Humanizer Tool',
    description: 'Convert AI-generated text into natural, human-like writing. Bypass AI detection and achieve 100% originality.',
    images: ['https://humanize-ai.top/og-image.jpg'], // 使用相同的图片
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${montserrat.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  )
}
