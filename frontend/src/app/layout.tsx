"use client"
// import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import { ThemeProvider } from '@/components/providers/theme-provider';
//import Router from 'next/router';
const inter = Inter({ subsets: ['latin'] });
import { BrowserRouter } from "react-router-dom";
// export const metadata: Metadata = {
//   title: 'CodeGen AI - AI Code Generation',
//   description: 'Generate code using AI with custom prompts and training data',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark:bg-gray-950 dark:text-gray-100`}>
        <BrowserRouter>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
        </BrowserRouter>
      </body>
    </html>
  );
}