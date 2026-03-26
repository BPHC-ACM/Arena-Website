import { notFound } from 'next/navigation';
import { SPORTS, getSport, type SportId } from '@/app/lib/sports';
import { SportPageClient } from '@/components/scoreboards/SportPageClient';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ sport: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport } = await params;
  const config = SPORTS.find((s) => s.id === sport);

  if (!config) {
    return {
      title: 'Sport Not Found | Arena 2026',
    };
  }

  return {
    title: `${config.name} | Arena 2026`,
  };
}

export default async function SportPage({ params }: Props) {
  const { sport } = await params;

  if (!SPORTS.find((s) => s.id === sport)) {
    notFound();
  }

  return <SportPageClient sport={sport as SportId} />;
}
