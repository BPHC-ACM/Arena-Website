import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team | Arena 2026',
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
