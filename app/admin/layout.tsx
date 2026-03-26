import { Metadata } from 'next';
import { AdminLayoutClient } from './AdminLayoutClient';

export const metadata: Metadata = {
  title: 'Admin | Arena 2026',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
