'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SPORTS, ACCENT } from '@/app/lib/sports';
import { cn } from '@/app/lib/utils';
import { useState } from 'react';
import { ShieldHalf, Menu, ChevronLeft, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                className='flex items-center gap-2 text-[#555] text-sm hover:text-[#888] transition-colors'
              >
                <ChevronLeft className='w-4 h-4 mr-1' />
                Scoreboards
              </Link>
              <div className='mt-3 flex items-center gap-2'>
                <ShieldHalf
                  className='w-3.5 h-3.5 flex-shrink-0'
                  style={{ color: ACCENT }}
                />
                <p
                  className='text-[11px] font-bold tracking-[0.16em] uppercase'
                  style={{ color: ACCENT }}
                >
                  Admin Panel
                </p>
              </div>
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
            className='flex items-center gap-2 text-[#555] text-sm hover:text-[#888] transition-colors'
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
            Scoreboards
          </Link>
          <div className='mt-3 flex items-center gap-2'>
            <ShieldHalf
              className='w-3.5 h-3.5 flex-shrink-0'
              style={{ color: ACCENT }}
            />
            <p
              className='text-[11px] font-bold tracking-[0.16em] uppercase'
              style={{ color: ACCENT }}
            >
              Admin Panel
            </p>
          </div>
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
  return (
    <>
      {SPORTS.map((sport) => {
        const active = pathname === `/admin/${sport.id}`;
        return (
          <Link
            key={sport.id}
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
            {sport.name}
          </Link>
        );
      })}
    </>
  );
}
