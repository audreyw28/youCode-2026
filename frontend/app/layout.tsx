import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YouCode Resource Finder',
  description: 'Find shelters, emergency childcare, and career transition support in a playful, easy-to-scan guide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
