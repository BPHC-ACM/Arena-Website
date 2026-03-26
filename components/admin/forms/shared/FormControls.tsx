import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ACCENT, SportId } from '@/app/lib/sports';
import { Minus, Plus, Save } from 'lucide-react';
import { STATUS_OPTS } from './constants';

export function TF({ label, value, onChange, type = 'text', placeholder = '' }: any) {
  return (
    <div className='space-y-1.5'>
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className='bg-[#0d0d0d] border-[#222] text-sm h-9'
        step={type === 'number' ? 'any' : undefined}
      />
    </div>
  );
}

export function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className='space-y-1.5'>
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
        {label}
      </Label>
      <div className='flex items-center gap-2'>
        <button
          onClick={(e) => { e.preventDefault(); onChange(Math.max(0, value - 1)); }}
          className='w-9 h-9 rounded-lg bg-[#161616] border border-[#222] text-white hover:bg-[#222] flex items-center justify-center'
        >
          <Minus className='w-3 h-3 flex-shrink-0' />
        </button>
        <span className='font-mono text-xl font-bold text-white w-12 text-center'>
          {value}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); onChange(value + 1); }}
          className='w-9 h-9 rounded-lg bg-[#161616] border border-[#222] text-white hover:bg-[#222] flex items-center justify-center'
        >
          <Plus className='w-3 h-3 flex-shrink-0' />
        </button>
      </div>
    </div>
  );
}

export function Toggle({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { l: string; v: any }[];
  value: any;
  onChange: (v: any) => void;
}) {
  return (
    <div className='space-y-1.5'>
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
        {label}
      </Label>
      <div className='flex gap-2 flex-wrap'>
        {options.map((o) => (
          <button
            key={String(o.v)}
            onClick={(e) => { e.preventDefault(); onChange(o.v); }}
            className='px-3 h-9 rounded-lg text-sm font-semibold border transition-colors'
            style={
              String(value) === String(o.v)
                ? {
                    background: `${ACCENT}20`,
                    borderColor: `${ACCENT}44`,
                    color: ACCENT,
                  }
                : { background: '#0d0d0d', borderColor: '#222', color: '#888' }
            }
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatusSelect({
  sport,
  value,
  onChange,
}: {
  sport: SportId;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className='space-y-1.5 w-full'>
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
        Status
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='bg-[#0d0d0d] border-[#222] text-sm h-9 w-full'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className='bg-[#111] border-[#222]'>
          {(STATUS_OPTS[sport] ?? []).map((s) => (
            <SelectItem key={s} value={s} className='text-sm'>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SaveBtn({
  onClick,
  isCreate,
}: {
  onClick: () => void;
  isCreate?: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className='w-full h-12 rounded-xl text-sm font-bold text-black flex items-center justify-center gap-2 transition-opacity hover:opacity-90'
      style={{ background: ACCENT }}
    >
      <Save className='w-4 h-4 mr-2 flex-shrink-0' />
      {isCreate ? 'Create Match' : 'Save Changes'}
    </button>
  );
}
