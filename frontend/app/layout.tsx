import type { Metadata } from 'next';
import { Baloo_2, Patrick_Hand } from 'next/font/google';
import './globals.css';

const displayFont = Baloo_2({
  variable: '--font-display',
  subsets: ['latin'],
});

const handFont = Patrick_Hand({
  variable: '--font-hand',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'YouCode Resource Finder',
  description: 'Find shelters, food programs, and community centres in a playful, easy-to-scan guide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${handFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
