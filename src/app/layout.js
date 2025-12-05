import './globals.css'

export const metadata = {
  title: 'MySpace Resurrection',
  description: 'The chaotic social network is back',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
