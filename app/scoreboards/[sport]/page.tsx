'use client';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { useMatchStream } from '@/app/lib/useMatchStream';
import { SPORTS, getSport, ACCENT, type SportId } from '@/app/lib/sports';
import { MatchCard } from '@/components/scoreboards/MatchCard';
import { AlertTriangle, Loader2 } from 'lucide-react';

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
    <div className='px-4 py-6 md:px-10 md:py-10 max-w-3xl mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-8'>
        <div className='p-3 rounded-xl bg-[#161616] border border-[#1e1e1e] flex items-center justify-center'>
          <i className={`${config.icon} text-xl w-5 h-5 flex items-center justify-center`} style={{ color: ACCENT }}></i>
        </div>
        <div className='flex-1'>
          <h1 className='text-2xl font-bold text-white'>{config.name}</h1>
        </div>
        <span
          title={wsConnected ? 'Live updates on' : 'Disconnected'}
          className='w-2.5 h-2.5 rounded-full transition-all flex-shrink-0'
          style={{
            background: wsConnected ? ACCENT : '#2a2a2a',
            boxShadow: wsConnected ? `0 0 8px ${ACCENT}` : 'none',
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className='flex items-center gap-3 p-4 mb-6 rounded-xl bg-[#180a0a] border border-[#2e1010] text-[15px] text-[#a05050]'>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className='flex justify-center py-20'>
          <Loader2 className="animate-spin text-[#333] w-6 h-6" />
        </div>
      )}

      {/* Empty */}
      {!loading && !error && matches.length === 0 && (
        <div className='py-20 text-center text-base text-[#444]'>
          No matches yet for {config.name}.
        </div>
      )}

      {/* Matches */}
      {!loading && matches.length > 0 && (
        <div className='flex flex-col gap-4'>
          {matches.map((match) => (
            <MatchCard key={match.id} sport={sport} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
