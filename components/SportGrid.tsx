'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { SPORTS, ACCENT } from '@/app/lib/sports';
import { cn } from '@/app/lib/utils';
import { useFavourites } from '@/app/lib/useFavourites';

interface SportGridProps {
  basePath: string;
}

export default function SportGrid({ basePath }: SportGridProps) {
  const { favourites, isLoaded } = useFavourites();

  const { favouriteSports, otherSports } = useMemo(() => {
    if (!isLoaded) return { favouriteSports: [], otherSports: SPORTS };
    const favs = SPORTS.filter((s) => favourites.includes(s.id));
    const rest = SPORTS.filter((s) => !favourites.includes(s.id));
    return { favouriteSports: favs, otherSports: rest };
  }, [favourites, isLoaded]);

  const renderRow = (sport: (typeof SPORTS)[0]) => (
    <Link
      key={sport.id}
      href={`${basePath}/${sport.id}`}
      className={cn(
        'flex items-center gap-4 px-4 py-3.5 rounded-2xl mb-2',
        'bg-[#0d0d0d] border border-[#1c1c1c]',
        'hover:border-[#2a2a2a] hover:bg-[#111]',
        'transition-all duration-200 active:scale-[0.98]',
      )}
    >
      {/* Circular icon avatar */}
      <div
        className='w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0'
        style={{ backgroundColor: `${ACCENT}18` }}
      >
        <i className={`${sport.icon} text-lg`} style={{ color: ACCENT }} />
      </div>

      {/* Sport name */}
      <span className='text-[16px] font-semibold text-[#ccc] truncate'>
        {sport.name}
      </span>
    </Link>
  );

  return (
    <div className='max-w-md p-4 md:py-12'>
      {favouriteSports.length > 0 && (
        <>
          <p className='text-[10px] uppercase tracking-widest font-bold text-[#444] mb-3 px-1'>
            Favourites
          </p>
          {favouriteSports.map(renderRow)}
          <div className='my-5 border-t border-[#1c1c1c]' />
        </>
      )}

      {otherSports.length > 0 && (
        <>
          {favouriteSports.length > 0 && (
            <p className='text-[10px] uppercase tracking-widest font-bold text-[#444] mb-3 px-1'>
              All Sports
            </p>
          )}
          {otherSports.map(renderRow)}
        </>
      )}
    </div>
  );
}
