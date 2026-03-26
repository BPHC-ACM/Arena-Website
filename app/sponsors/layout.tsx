import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsors | Arena 2026',
};

export default function SponsorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
