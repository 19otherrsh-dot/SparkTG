import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LedgerAI — AI-First Financial Operating System',
  description:
    'LedgerAI is an intelligent accounting platform powered by AI agents that automate bookkeeping, tax compliance, payroll, audit, and financial strategy for Indian businesses.',
  keywords: [
    'AI accounting',
    'bookkeeping automation',
    'GST compliance',
    'Indian accounting software',
    'AI CFO',
    'financial operating system',
  ],
  authors: [{ name: 'SparkTG' }],
  openGraph: {
    title: 'LedgerAI — AI-First Financial Operating System',
    description:
      'Intelligent accounting powered by AI agents. Automate bookkeeping, tax, payroll, audit, and financial strategy.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-[#0a0e1a] text-slate-100 antialiased font-sans min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
