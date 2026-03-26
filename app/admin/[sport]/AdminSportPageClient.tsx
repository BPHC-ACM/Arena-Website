'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { getSport, ACCENT, type SportId } from '@/app/lib/sports';
import { useMatchStream } from '@/app/lib/useMatchStream';
import { isInProgress } from '@/app/lib/utils';
import { API_BASE_URL } from '@/app/lib/websocket';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  XCircle,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { useFavourites } from '@/app/lib/useFavourites';
import { cn } from '@/app/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CricketAdminForm } from '@/components/admin/forms/CricketAdminForm';
import { GenericAdminForm } from '@/components/admin/forms/GenericAdminForm';
import { CreateMatchModal } from '@/components/admin/CreateMatchModal';
import { useAdminAuth } from '../AdminAuthContext';

export function AdminSportPageClient({ sport }: { sport: SportId }) {
  const config = getSport(sport);
  const { matches, loading } = useMatchStream(sport);
  const { toggleFavourite, isFavourite } = useFavourites();
  const isFav = isFavourite(sport);

  const { token, logout } = useAdminAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [sport]);

  // Match selection
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const selectedMatch = matches.find((m) => m.id === selectedMatchId) ?? null;
  useEffect(() => {
    if (matches.length && !selectedMatchId) setSelectedMatchId(matches[0].id);
  }, [matches, selectedMatchId]);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Status message (shared for update/create/delete)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );

  const mutate = useCallback(
    async (method: 'PUT' | 'POST' | 'DELETE', path: string, body: any) => {
      if (!token) {
        return;
      }
      if (method === 'POST') setStatus({ ok: true, msg: 'Saving…' });
      else setStatus(null);
      try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error ?? 'Request failed');
        if (method === 'POST' || method === 'DELETE') {
          setStatus({ ok: true, msg: 'Saved successfully' });
          setTimeout(() => setStatus(null), 3000);
        } else {
          setStatus(null);
        }
      } catch (err) {
        setStatus({
          ok: false,
          msg: err instanceof Error ? err.message : 'Error occurred',
        });
      }
    },
    [token, sport],
  );

  const updateMatch = (body: any) =>
    mutate('PUT', `/${sport}/${selectedMatchId}/update`, body);
  const createMatch = (body: any) =>
    mutate('POST', `/${sport}`, {
      ...body,
      status: sport === 'cricket' ? 'Innings I' : 'Live',
    });
  const deleteMatch = (id: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this match? This action cannot be undone.',
      )
    ) {
      return;
    }
    mutate('DELETE', `/${sport}/${id}`, {});
  };

  return (
    <div className='px-4 py-6 md:px-10 md:py-10 max-w-2xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <div className='p-3 rounded-xl bg-[#161616] border border-[#1e1e1e] flex items-center justify-center'>
          <i
            className={`${config.icon} text-xl w-5 h-5 flex items-center justify-center`}
            style={{ color: ACCENT }}
          ></i>
        </div>
        <div className='flex-1'>
          <div className='flex items-center gap-2.5'>
            <h1 className='text-2xl font-bold text-white'>{config.name}</h1>
          </div>
        </div>
        <button
          onClick={() => toggleFavourite(sport)}
          className={cn(
            "p-2.5 rounded-xl border transition-all active:scale-95",
            isFav
              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
              : "bg-[#161616] border-[#1e1e1e] text-[#444] hover:text-[#888]"
          )}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={cn("w-4 h-4", isFav && "fill-current")} />
        </button>
        {token && (
          <button
            onClick={logout}
            className='p-2.5 rounded-xl bg-[#161616] border border-[#1e1e1e] text-[#555] hover:text-red-400 transition-all active:scale-95'
            title='Logout'
          >
            <LogOut className='w-4 h-4' />
          </button>
        )}
      </div>

      {!mounted ? (
        <div className='flex justify-center py-10'>
          <Loader2 className='animate-spin text-2xl text-[#333] w-6 h-6' />
        </div>
      ) : (
        <>
          {token && (
            <div className='space-y-5'>
              {loading && (
                <div className='flex justify-center py-10'>
                  <Loader2 className='animate-spin text-[#333] w-6 h-6' />
                </div>
              )}

              {/* Match selector row */}
              {!loading && (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label
                      className='text-[13px] font-bold tracking-widest uppercase'
                      style={{ color: ACCENT }}
                    >
                      Score Updates
                    </Label>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className='flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg border transition-colors'
                      style={{
                        color: ACCENT,
                        borderColor: `${ACCENT}00`,
                      }}
                    >
                      <Plus className='w-3.5 h-3.5 flex-shrink-0' />
                      New Match
                    </button>
                  </div>

                  {matches.length === 0 ? (
                    <p className='text-[15px] text-center text-[#444] py-10'>
                      No matches yet. Create one first.
                    </p>
                  ) : (
                    <Select
                      value={String(selectedMatchId)}
                      onValueChange={(v) => setSelectedMatchId(Number(v))}
                    >
                      <SelectTrigger className='w-full bg-[#0d0d0d] border-[#222] text-[15px] h-11'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-[#111] border-[#222]'>
                        {matches.map((m) => (
                          <SelectItem
                              key={m.id}
                              value={String(m.id)}
                              className='text-[14px]'
                          >
                            <div className='flex items-center gap-2'>
                              {isInProgress(m) && (
                                <span
                                  className='w-1.5 h-1.5 rounded-full inline-block flex-shrink-0'
                                  style={{ background: ACCENT }}
                                />
                              )}
                              #{m.id} - {m.teamA ?? m.player1} vs{' '}
                              {m.teamB ?? m.player2}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {/* Update form */}
              {selectedMatch && (
                <>
                  <div className='h-px bg-[#1c1c1c]' />
                  <div className='pt-2'>
                    {sport === 'cricket' ? (
                      <CricketAdminForm
                        match={selectedMatch}
                        onSave={updateMatch}
                      />
                    ) : (
                      <GenericAdminForm
                        sport={sport}
                        match={selectedMatch}
                        onSave={updateMatch}
                      />
                    )}
                  </div>
                </>
              )}

              {/* Status banner */}
              {status && (
                <div
                  className={`flex items-center gap-2.5 text-[14px] px-4 py-3 rounded-xl ${status.ok ? 'bg-[#0d150a]' : 'bg-[#180a0a]'}`}
                  style={{
                    border: `1px solid ${status.ok ? `${ACCENT}30` : '#5c1a1a'}`,
                  }}
                >
                  {status.ok ? (
                    <CheckCircle2
                      className='w-4 h-4'
                      style={{ color: ACCENT }}
                    />
                  ) : (
                    <XCircle className='w-4 h-4' style={{ color: '#ef4444' }} />
                  )}
                  <span style={{ color: status.ok ? ACCENT : '#ef4444' }}>
                    {status.msg}
                  </span>
                </div>
              )}

              {/* Delete */}
              {selectedMatch && (
                <div className='flex justify-end'>
                  <button
                    onClick={() => deleteMatch(selectedMatch.id)}
                    className='flex items-center gap-2 text-[13px] text-[#555] hover:text-red-400 transition-colors'
                  >
                    <Trash2 className='w-4 h-4 flex-shrink-0' />
                    Delete this match
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Create Match Modal */}
      {showCreateModal && (
        <CreateMatchModal
          sport={sport}
          onClose={() => setShowCreateModal(false)}
          onCreate={createMatch}
        />
      )}
    </div>
  );
}
