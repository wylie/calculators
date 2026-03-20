interface AdSlotProps {
  slotId?: string;
}

export default function AdSlot({ slotId = 'default' }: AdSlotProps) {
  const isDev = import.meta.env.DEV;

  if (isDev) {
    return (
      <div className="my-3 md:my-6">
        <div className="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-4 text-center text-sm text-slate-800">
          Ad placeholder (local only)
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 md:my-6">
      <div
        className="monetag-ad-slot mx-auto min-h-[90px] w-full max-w-[728px]"
        data-monetag-slot={slotId}
        aria-label="Advertisement"
      />
    </div>
  );
}
