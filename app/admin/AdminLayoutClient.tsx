'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SPORTS, ACCENT } from '@/app/lib/sports';
import { cn } from '@/app/lib/utils';
import { useState, useMemo } from 'react';
import { ShieldHalf, Menu, ChevronLeft, X } from 'lucide-react';
import { useFavourites } from '@/app/lib/useFavourites';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { token, login, isVerifying } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (success) {
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (!token) {
    return (
      <div className='fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] text-[#e5e5e5] p-6'>
        <div className='w-full max-w-md bg-[#0d0d0d] border border-[#1c1c1c] rounded-3xl p-8 md:p-10 shadow-2xl'>
          <div className='mb-8 text-center'>
            <div className='w-16 h-16 bg-[#57a639]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
              <ShieldHalf className='w-8 h-8 text-[#57a639]' />
            </div>
            <h1 className='text-2xl font-black italic tracking-tighter uppercase mb-2'>
              Admin <span className='text-[#57a639]'>Access</span>
            </h1>
            <p className='text-[#666] text-xs uppercase tracking-widest font-semibold'>
              Restricted Area - Authentication Required
            </p>
          </div>

          <form onSubmit={handleLogin} className='space-y-6'>
            <div>
              <input
                type='password'
                placeholder='ENTER PASSWORD'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  'w-full bg-[#161616] border border-[#222] rounded-xl px-5 py-4 text-center text-lg tracking-[0.3em] font-bold focus:outline-none focus:border-[#57a639] transition-all',
                  error && 'border-red-500/50 bg-red-500/5'
                )}
                autoFocus
              />
              {error && (
                <p className='text-red-500 text-[10px] uppercase font-bold tracking-widest text-center mt-3 animate-pulse'>
                  Invalid Password
                </p>
              )}
            </div>
            <button
              type='submit'
              disabled={isVerifying}
              className='w-full bg-[#57a639] hover:bg-[#4d9432] text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
            >
              {isVerifying ? 'Verifying...' : 'Unlock Access'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col md:flex-row h-[100dvh] bg-[#0a0a0a] text-[#e5e5e5] overflow-hidden'>
      {/* Mobile Header */}
      <div className='md:hidden flex items-center justify-between px-5 py-3.5 border-b border-[#1c1c1c] bg-[#0d0d0d] flex-shrink-0'>
        <div className='flex items-center gap-2.5'>
          <ShieldHalf
            className='w-4 h-4 flex-shrink-0'
            style={{ color: ACCENT }}
          />
          <p
            className='text-[13px] font-bold tracking-widest uppercase'
            style={{ color: ACCENT }}
          >
            Admin Panel
          </p>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className='text-[#888] hover:text-white p-1'
        >
          <Menu className='w-5 h-5 flex-shrink-0' />
        </button>
      </div>

      {/* Mobile Sidebar Overlay (Animated) */}
      <div
        className={`md:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className='absolute inset-0 bg-black/80 backdrop-blur-sm'
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside
          className={`relative flex w-64 max-w-[80vw] flex-col bg-[#0d0d0d] border-r border-[#1c1c1c] h-full shadow-2xl transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className='px-5 py-5 border-b border-[#181818] flex justify-between items-start'>
            <div>
              <Link
                href='/scoreboards'
                className='flex items-center gap-2 text-[#555] text-lg hover:text-[#888] transition-colors'
              >
                <ChevronLeft className='w-4 h-4 mr-1' />
                Scoreboards
              </Link>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className='text-[#666] hover:text-white p-1'
            >
              <X className='w-5 h-5 flex-shrink-0' />
            </button>
          </div>
          <nav
            className='flex-1 overflow-y-auto p-2.5'
            data-lenis-prevent='true'
          >
            <AdminNavItems onClick={() => setMobileMenuOpen(false)} />
          </nav>
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className='hidden md:flex w-56 flex-shrink-0 flex-col border-r border-[#1c1c1c] bg-[#0d0d0d]'>
        <div className='px-5 py-5 border-b border-[#181818]'>
          <Link
            href='/scoreboards'
            className='flex items-center gap-2 text-[#555] text-lg hover:text-[#888] transition-colors'
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
            Scoreboards
          </Link>
        </div>
        <nav className='flex-1 overflow-y-auto p-2.5' data-lenis-prevent='true'>
          <AdminNavItems />
        </nav>
        <div className='p-3 border-t border-[#181818] text-center'>
          <p className='text-[10px] text-[#2e2e2e] uppercase tracking-widest'>
            Firewallz Access
          </p>
        </div>
      </aside>
      <div className='flex-1 flex flex-col min-h-0 overflow-hidden relative'>
        <main
          className='flex-1 overflow-y-auto min-h-0'
          data-lenis-prevent='true'
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminNavItems({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  const { favourites, isLoaded } = useFavourites();

  const sortedSports = useMemo(() => {
    if (!isLoaded) return SPORTS;
    return [...SPORTS].sort((a, b) => {
      const aFav = favourites.includes(a.id);
      const bFav = favourites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [favourites, isLoaded]);

  const { favouriteSports, otherSports } = useMemo(() => {
    const favs = sortedSports.filter(s => favourites.includes(s.id));
    const nonFavs = sortedSports.filter(s => !favourites.includes(s.id));
    return { favouriteSports: favs, otherSports: nonFavs };
  }, [sortedSports, favourites]);

  return (
    <>
      {favouriteSports.map((sport) => {
        const active = pathname === `/admin/${sport.id}`;
        return (
          <AdminNavLink
            key={sport.id}
            sport={sport}
            active={active}
            onClick={onClick}
          />
        );
      })}

      {favouriteSports.length > 0 && otherSports.length > 0 && (
        <div className='my-4 border-t border-[#1c1c1c]' />
      )}

      {otherSports.map((sport) => {
        const active = pathname === `/admin/${sport.id}`;
        return (
          <AdminNavLink
            key={sport.id}
            sport={sport}
            active={active}
            onClick={onClick}
          />
        );
      })}
    </>
  );
}

function AdminNavLink({ 
  sport, 
  active, 
  onClick 
}: { 
  sport: typeof SPORTS[0]; 
  active: boolean; 
  onClick?: () => void 
}) {
  return (
    <Link
      href={`/admin/${sport.id}`}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3.5 py-3 rounded-md mb-0.5 text-[15px] transition-all',
        active
          ? 'border font-semibold'
          : 'text-[#666] hover:text-[#ccc] hover:bg-[#161616] border border-transparent',
      )}
      style={
        active
          ? {
              background: 'rgba(87,166,57,0.12)',
              border: '1px solid rgba(87,166,57,0.22)',
              color: ACCENT,
            }
          : {}
      }
    >
      <i
        className={`${sport.icon} text-base w-4 text-center flex-shrink-0`}
      ></i>
      <span className="truncate">{sport.name}</span>
    </Link>
  );
}
