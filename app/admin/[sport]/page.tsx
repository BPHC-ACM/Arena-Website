import { notFound } from 'next/navigation';
import { SPORTS, type SportId } from '@/app/lib/sports';
import { AdminSportPageClient } from './AdminSportPageClient';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ sport: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport } = await params;
  const config = SPORTS.find((s) => s.id === sport);

  if (!config) {
    return {
      title: 'Sport Not Found | Admin | Arena 2026',
    };
  }

  return {
    title: `${config.name} | Admin | Arena 2026`,
  };
}

export default async function AdminSportPage({ params }: Props) {
  const { sport } = await params;

  if (!SPORTS.find((s) => s.id === sport)) {
    notFound();
  }

  return <AdminSportPageClient sport={sport as SportId} />;
}
