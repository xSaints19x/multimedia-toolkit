import './globals.css'
import React, { ReactNode } from "react";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Multimedia Forensics Toolkit',
  description: 'A multimedia enhancer to optimise audio, video, and image files',
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
