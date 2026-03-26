'use client';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { useMatchStream } from '@/app/lib/useMatchStream';
import { SPORTS, getSport, ACCENT, type SportId } from '@/app/lib/sports';
import { MatchCard } from '@/components/scoreboards/MatchCard';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function SportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = use(params);
  if (!SPORTS.find((s) => s.id === sport)) notFound();
  return <SportPageInner sport={sport as SportId} />;
}

function SportPageInner({ sport }: { sport: SportId }) {
  const { matches, loading, error, wsConnected } = useMatchStream(sport);
  const config = getSport(sport);

  return (
    <div className='relative px-4 py-6 md:px-10 md:py-10 max-w-3xl mx-auto'>
      {/* Arena logo watermark */}
      <div
        className='pointer-events-none fixed inset-0 flex items-center justify-center z-0'
        aria-hidden='true'
      >
        <Image
          src='/arena%20logo_%202.png'
          alt=''
          width={420}
          height={420}
          className='w-[420px] max-w-[60vw] opacity-[0.3] grayscale select-none'
        />
      </div>

      {/* Header */}
      <div className='relative z-10 flex items-center gap-4 mb-8'>
        <div className='p-3 rounded-xl bg-[#161616] border border-[#1e1e1e] flex items-center justify-center'>
          <i
            className={`${config.icon} text-xl w-5 h-5 flex items-center justify-center`}
            style={{ color: ACCENT }}
          ></i>
        </div>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold text-white'>{config.name}</h1>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='relative z-10 flex items-center gap-3 p-4 mb-6 rounded-xl bg-[#180a0a] border border-[#2e1010] text-[15px] text-[#a05050]'>
          <AlertTriangle className='w-4 h-4 flex-shrink-0' />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className='relative z-10 flex justify-center py-20'>
          <Loader2 className='animate-spin text-[#333] w-6 h-6' />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && matches.length === 0 && (
        <div className='relative z-10 py-20 text-center text-base text-[#444]'>
          No matches yet for {config.name}.
        </div>
      )}

      {/* Matches */}
      {!loading && matches.length > 0 && (
        <div className='relative z-10 flex flex-col gap-4'>
          {matches.map((match) => (
            <MatchCard key={match.id} sport={sport} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
