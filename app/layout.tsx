import './globals.css';
import './Home.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description:
    'Keep your thoughts safe and organized with Note Hub — a convenient, fast, and reliable personal notebook without unnecessary clutter.',
  openGraph: {
    title: 'NoteHub',
    description:
      'Manage your notes efficiently. Note Hub — your simple and focused notebook designed to capture ideas effortlessly. It’s fast, dependable, and distraction-free — the perfect place to think and create with clarity.',
    url: 'https://08-zustand-steel-mu.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub preview image',
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>

            {modal}

            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
