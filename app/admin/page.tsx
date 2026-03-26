import SportGrid from '@/components/SportGrid';

export default function AdminIndex() {
  return (
    <div className='flex-1'>
      <SportGrid basePath='/admin' />
    </div>
  );
}
