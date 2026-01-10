import './globals.css'

export const metadata = {
  title: 'Paggo OCR',
  description: 'Sistema de OCR com IA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}