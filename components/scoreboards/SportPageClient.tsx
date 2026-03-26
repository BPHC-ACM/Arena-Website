'use client';

import { useMatchStream } from '@/app/lib/useMatchStream';
import { getSport, ACCENT, type SportId } from '@/app/lib/sports';
import { MatchCard } from '@/components/scoreboards/MatchCard';
import { AlertTriangle, Star } from 'lucide-react';
import Image from 'next/image';
import { useFavourites } from '@/app/lib/useFavourites';
import { cn } from '@/app/lib/utils';
import { SkeletonMatchCard } from '@/components/scoreboards/SkeletonMatchCard';

export function SportPageClient({ sport }: { sport: SportId }) {
  const { matches, loading, error } = useMatchStream(sport);
  const { toggleFavourite, isFavourite } = useFavourites();
  const config = getSport(sport);
  const isFav = isFavourite(sport);

  return (
    <div className='relative w-full px-4 py-6 md:px-10 md:py-10'>
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
          className='w-[320px] max-w-[60vw] opacity-[0.3] grayscale select-none'
        />
      </div>

      {/* Header */}
      <div className='relative z-10 flex items-center w-full gap-4 mb-8'>
        <div className='p-3 rounded-xl bg-[#161616] border border-[#1e1e1e] flex items-center justify-center'>
          <i
            className={`${config.icon} text-xl w-5 h-5 flex items-center justify-center`}
            style={{ color: ACCENT }}
          ></i>
        </div>
        <div className='flex-1 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-white'>{config.name}</h1>
          <button
            onClick={() => toggleFavourite(sport)}
            className={cn(
              'p-2.5 rounded-xl border transition-all active:scale-95',
              isFav
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                : 'bg-[#161616] border-[#1e1e1e] text-[#444] hover:text-[#888]',
            )}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={cn('w-5 h-5', isFav && 'fill-current')} />
          </button>
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
        <div className='relative z-10 flex flex-col gap-4'>
          <SkeletonMatchCard />
          <SkeletonMatchCard />
          <SkeletonMatchCard />
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
