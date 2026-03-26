'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, use } from 'react';
import { notFound } from 'next/navigation';
import { SPORTS, getSport, ACCENT, type SportId } from '@/app/lib/sports';
import { useMatchStream } from '@/app/lib/useMatchStream';
import { isInProgress } from '@/app/lib/utils';
import { API_BASE_URL } from '@/app/lib/websocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Lock,
  ShieldHalf,
  XCircle,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
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

export default function AdminSportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = use(params);
  if (!SPORTS.find((s) => s.id === sport)) notFound();
  return <AdminPageInner sport={sport as SportId} />;
}

function AdminPageInner({ sport }: { sport: SportId }) {
  const config = getSport(sport);
  const { matches, loading } = useMatchStream(sport);

  const [token, setToken] = useState('');
  const [mounted, setMounted] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken('');
    setTokenInput('');
  }, [sport]);

  const [verifying, setVerifying] = useState(false);
  const applyToken = async () => {
    if (!tokenInput.trim() || verifying) return;
    setVerifying(true);
    setTokenError(false);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${tokenInput.trim()}` },
      });
      if (!res.ok) throw new Error();
      setToken(tokenInput.trim());
    } catch {
      setTokenError(true);
    } finally {
      setVerifying(false);
    }
  };

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
        setTokenError(true);
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
    [token],
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
        {token && (
          <button
            onClick={() => {
              setToken('');
              setTokenInput('');
            }}
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
          {/* Token gate */}
          {!token && (
            <div className='rounded-xl bg-[#111] border border-[#2a2a2a] p-6 space-y-4'>
              <div className='flex items-center gap-2.5 mb-2'>
                <Lock
                  className='w-4 h-4 flex-shrink-0'
                  style={{ color: ACCENT }}
                />
                <p className='text-base font-semibold text-white'>
                  Enter Admin Password
                </p>
              </div>
              <div className='space-y-1.5'>
                <Label className='text-[13px] text-[#666]'>Password</Label>
                <div className='flex gap-2'>
                  <Input
                    type='password'
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyToken()}
                    placeholder='Enter password…'
                    className='bg-[#0d0d0d] border-[#2a2a2a] text-base h-10 flex-1'
                  />
                  <Button
                    onClick={applyToken}
                    disabled={verifying}
                    className='h-10 px-5 font-bold text-black'
                    style={{ background: ACCENT }}
                  >
                    {verifying ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <>
                        <ShieldHalf className='w-4 h-4 mr-2' />
                        Unlock
                      </>
                    )}
                  </Button>
                </div>
                {tokenError && (
                  <p className='text-[13px] text-red-400 flex items-center gap-1.5'>
                    <XCircle className='w-4 h-4 flex-shrink-0' />
                    Invalid password.
                  </p>
                )}
              </div>
            </div>
          )}

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
                    <Label className='text-md text-[#666]'>Score Updates</Label>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className='flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg border transition-colors'
                      style={{
                        color: ACCENT,
                        borderColor: `${ACCENT}44`,
                        background: `${ACCENT}12`,
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
