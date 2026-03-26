import { Metadata } from 'next';
import SportGrid from '@/components/SportGrid';

export const metadata: Metadata = {
  title: 'Scores | Arena 2026',
};

export default function ScoreboardsIndex() {
  return (
    <div className='flex-1'>
      <SportGrid basePath='/scoreboards' />
    </div>
  );
}
