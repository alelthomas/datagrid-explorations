import { Inter } from 'next/font/google'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Data Grid Demos',
  description:
    'A collection of Material-UI Data Grid examples showcasing different use cases and customizations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
