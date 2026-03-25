'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, use } from 'react';
import { notFound } from 'next/navigation';
import { SPORTS, getSport, ACCENT, type SportId } from '@/app/lib/sports';
import { useMatchStream } from '@/app/lib/useMatchStream';
import { isInProgress } from '@/app/lib/utils';
import { API_BASE_URL } from '@/app/lib/websocket';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Lock,
  ShieldHalf,
  XCircle,
  CheckCircle2,
  Plus,
  Trash2,
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
  const { matches, loading, wsConnected } = useMatchStream(sport);

  const [token, setToken] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken('');
    setTokenInput('');
  }, [sport]);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState(false);

  const applyToken = () => {
    if (!tokenInput.trim()) return;
    setToken(tokenInput.trim());
    setTokenError(false);
  };

  // Match selection
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const selectedMatch = matches.find((m) => m.id === selectedMatchId) ?? null;
  useEffect(() => {
    if (matches.length && !selectedMatchId) setSelectedMatchId(matches[0].id);
  }, [matches, selectedMatchId]);

  // Status messages
  const [updateStatus, setUpdateStatus] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [createStatus, setCreateStatus] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  const mutate = useCallback(
    async (
      method: 'PUT' | 'POST' | 'DELETE',
      path: string,
      body: any,
      onStatus: (s: { ok: boolean; msg: string } | null) => void,
    ) => {
      if (!token) {
        setTokenError(true);
        return;
      }
      if (method === 'POST') {
        onStatus({ ok: true, msg: 'Saving…' });
      } else {
        onStatus(null);
      }
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
          onStatus({ ok: true, msg: 'Saved successfully' });
          setTimeout(() => onStatus(null), 3000);
        } else {
          onStatus(null);
        }
      } catch (err) {
        onStatus({
          ok: false,
          msg: err instanceof Error ? err.message : 'Error occurred',
        });
      }
    },
    [token],
  );

  const updateMatch = (body: any) =>
    mutate('PUT', `/${sport}/${selectedMatchId}/update`, body, setUpdateStatus);
  const createMatch = (body: any) =>
    mutate('POST', `/${sport}`, body, setCreateStatus);
  const deleteMatch = (id: number) =>
    mutate('DELETE', `/${sport}/${id}`, {}, setUpdateStatus);

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
            <Badge
              variant='outline'
              className='text-[11px] font-bold tracking-widest'
              style={{ color: ACCENT, borderColor: `${ACCENT}44` }}
            >
              ADMIN
            </Badge>
          </div>
        </div>
        <span
          className='w-2.5 h-2.5 rounded-full flex-shrink-0'
          style={{
            background: wsConnected ? ACCENT : '#2a2a2a',
            boxShadow: wsConnected ? `0 0 8px ${ACCENT}` : 'none',
          }}
        />
      </div>

      {!mounted ? (
        <div className='flex justify-center py-10'>
          <Loader2 className='animate-spin text-2xl text-[#333] w-6 h-6' />
        </div>
      ) : (
        <>
          {/* Token gate */}
          {!token ? (
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
                    className='h-10 px-5 font-bold text-black'
                    style={{ background: ACCENT }}
                  >
                    <ShieldHalf className='w-4 h-4 mr-2' />
                    Unlock
                  </Button>
                </div>
                {tokenError && (
                  <p className='text-[13px] text-red-400 flex items-center gap-1.5'>
                    <XCircle className='w-3.5 h-3.5 flex-shrink-0 text-red-500' />
                    Password required to make changes.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div
              className='flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0d150a] border'
              style={{ borderColor: `${ACCENT}30` }}
            >
              <CheckCircle2
                className='w-4 h-4 flex-shrink-0'
                style={{ color: ACCENT }}
              />
              <span
                className='text-[15px] font-semibold'
                style={{ color: ACCENT }}
              >
                Authenticated
              </span>
              <button
                onClick={() => {
                  setToken('');
                  setTokenInput('');
                }}
                className='ml-auto text-[13px] text-[#555] hover:text-[#888] underline'
              >
                Logout
              </button>
            </div>
          )}

          {/* Tabs */}
          {token && (
            <Tabs defaultValue='update'>
              <TabsList className='bg-[#111] border border-[#222] w-full h-11'>
                <TabsTrigger
                  value='update'
                  className='flex-1 text-[14px] font-medium data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white'
                >
                  Update Match
                </TabsTrigger>
                <TabsTrigger
                  value='create'
                  className='flex-1 text-[14px] font-medium data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  New Match
                </TabsTrigger>
              </TabsList>

              {/* Update */}
              <TabsContent value='update' className='mt-5 space-y-5'>
                {loading && (
                  <div className='flex justify-center py-10'>
                    <Loader2 className='animate-spin text-[#333] w-6 h-6' />
                  </div>
                )}
                {!loading && matches.length === 0 && (
                  <p className='text-[15px] text-center text-[#444] py-10'>
                    No matches yet. Create one first.
                  </p>
                )}
                {!loading && matches.length > 0 && (
                  <>
                    <div className='flex items-center gap-2 px-4 py-3 bg-[#0d0d0d] border border-[#222] rounded-xl mb-4 text-[#888] text-sm'>
                      <span
                        className='w-2 h-2 rounded-full animate-pulse flex-shrink-0'
                        style={{ background: ACCENT }}
                      />
                      Your changes to this match are pushed live instantly.
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-[13px] text-[#666]'>Match</Label>
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
                    </div>

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

                    {updateStatus && (
                      <div
                        className={`flex items-center gap-2.5 text-[14px] px-4 py-3 rounded-xl ${updateStatus.ok ? 'bg-[#0d150a]' : 'bg-[#180a0a]'}`}
                        style={{
                          border: `1px solid ${updateStatus.ok ? `${ACCENT}30` : '#5c1a1a'}`,
                        }}
                      >
                        {updateStatus.ok ? (
                          <CheckCircle2
                            className='w-4 h-4'
                            style={{ color: ACCENT }}
                          />
                        ) : (
                          <XCircle
                            className='w-4 h-4'
                            style={{ color: '#ef4444' }}
                          />
                        )}
                        <span
                          style={{
                            color: updateStatus.ok ? ACCENT : '#ef4444',
                          }}
                        >
                          {updateStatus.msg}
                        </span>
                      </div>
                    )}

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
                  </>
                )}
              </TabsContent>

              <TabsContent value='create' className='mt-5 space-y-5'>
                <div className='pt-2'>
                  {sport === 'cricket' ? (
                    <CricketAdminForm
                      match={null}
                      onSave={createMatch}
                      isCreate
                    />
                  ) : (
                    <GenericAdminForm
                      sport={sport}
                      match={null}
                      onSave={createMatch}
                      isCreate
                    />
                  )}
                </div>
                {createStatus && (
                  <div
                    className={`flex items-center gap-2.5 text-[14px] px-4 py-3 rounded-xl ${createStatus.ok ? 'bg-[#0d150a]' : 'bg-[#180a0a]'}`}
                    style={{
                      border: `1px solid ${createStatus.ok ? `${ACCENT}30` : '#5c1a1a'}`,
                    }}
                  >
                    {createStatus.ok ? (
                      <CheckCircle2
                        className='w-4 h-4'
                        style={{ color: ACCENT }}
                      />
                    ) : (
                      <XCircle
                        className='w-4 h-4'
                        style={{ color: '#ef4444' }}
                      />
                    )}
                    <span
                      style={{ color: createStatus.ok ? ACCENT : '#ef4444' }}
                    >
                      {createStatus.msg}
                    </span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
}
