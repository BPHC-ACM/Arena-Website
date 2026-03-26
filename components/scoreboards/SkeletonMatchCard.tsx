import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonMatchCard() {
  return (
    <div className='rounded-xl border border-white/5 bg-[#111111]/75 p-5 md:p-6 backdrop-blur-sm shadow-xl'>
      <div className='grid grid-cols-[1fr_auto_1fr] gap-4 items-center'>
        {/* Team A */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 md:w-32" />
          <Skeleton className="h-10 w-16 md:w-20" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Separator / Clock */}
        <div className="flex flex-col items-center gap-2 px-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-3 w-10" />
        </div>

        {/* Team B */}
        <div className="space-y-3 flex flex-col items-end">
          <Skeleton className="h-5 w-24 md:w-32" />
          <Skeleton className="h-10 w-16 md:w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Detail Box Placeholder (Optional but looks good) */}
      <div className="mt-5 rounded-lg bg-white/[0.02] p-3 border border-white/[0.03]">
        <div className="flex gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Footer Share Button */}
      <div className='mt-5 pt-3 border-t border-white/5 flex justify-end'>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}
