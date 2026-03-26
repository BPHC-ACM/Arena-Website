import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | Arena 2026',
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
