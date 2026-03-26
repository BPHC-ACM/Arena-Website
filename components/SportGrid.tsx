'use client';

import Link from 'next/link';
import { SPORTS, ACCENT } from '@/app/lib/sports';
import { cn } from '@/app/lib/utils';

interface SportGridProps {
  basePath: string;
}

export default function SportGrid({ basePath }: SportGridProps) {
  return (
    <div className='p-6 md:p-10 max-w-7xl mx-auto'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
        {SPORTS.map((sport) => (
          <Link
            key={sport.id}
            href={`${basePath}/${sport.id}`}
            className={cn(
              'group relative flex flex-col items-center justify-center p-6 rounded-2xl',
              'bg-[#0d0d0d] border border-[#1c1c1c] hover:border-[#333]',
              'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#57a639]/10',
            )}
          >
            {/* Background Glow */}
            <div
              className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'
              style={{
                background: `radial-gradient(circle at center, ${ACCENT}15 0%, transparent 70%)`,
              }}
            />

            {/* Icon Container */}
            <div
              className='w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110'
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            >
              <i
                className={cn(
                  sport.icon,
                  'text-3xl md:text-4xl transition-colors duration-300 group-hover:text-white',
                )}
                style={{ color: ACCENT }}
              />
            </div>

            {/* Sport Name */}
            <span className='text-sm md:text-base font-bold text-center tracking-tight text-[#aaa] group-hover:text-white uppercase transition-colors'>
              {sport.name}
            </span>

            {/* Subtle Hover Indicator */}
            <div
              className='absolute bottom-3 w-8 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0'
              style={{ backgroundColor: ACCENT }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
