import type { Metadata } from 'next';
import css from './Home.module.css';

// metadata
export const metadata: Metadata = {
  title: 'Page Not Found — NoteHub',
  description:
    'The page you are looking for could not be found. Explore other sections of NoteHub to manage your notes efficiently.',
  openGraph: {
    title: '404 — Page Not Found | NoteHub',
    description:
      'This page could not be found. Visit NoteHub to organize and manage your notes efficiently.',
    url: 'https://08-zustand-steel-mu.vercel.app/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub 404 Page Preview',
      },
    ],
  },
};

export default function NotFoundPage() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
