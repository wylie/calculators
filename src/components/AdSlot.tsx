import { useEffect, useId, useRef, useState } from 'react';
import { ADSENSE_PUBLISHER_ID, ADSENSE_SLOTS, type AdSlotKey } from '../config/adsense';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      push: (value: Record<string, unknown>) => number;
    };
  }
}

interface AdSlotProps {
  slot: AdSlotKey;
  className?: string;
}

const ADSENSE_RETRY_LIMIT = 12;
const ADSENSE_RETRY_DELAY_MS = 250;
const isProduction = import.meta.env.PROD;
const isPlaceholderSlotId = (slotId: string) => /^0+$/.test(slotId);

export default function AdSlot({ slot, className = '' }: AdSlotProps) {
  const slotConfig = ADSENSE_SLOTS[slot];
  const adRef = useRef<HTMLModElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const slotReadyForAds = isProduction && !isPlaceholderSlotId(slotConfig.slotId);
  const [showFallback, setShowFallback] = useState(!slotReadyForAds);
  const fallbackId = useId();

  useEffect(() => {
    if (!slotReadyForAds) {
      return undefined;
    }

    let cancelled = false;

    const pushAd = (attempt = 0) => {
      const adElement = adRef.current;
      if (cancelled || !adElement) {
        return;
      }

      if (adElement.dataset.adsbygoogleStatus === 'done' || adElement.dataset.adInitialized === 'true') {
        setShowFallback(false);
        return;
      }

      if (typeof window === 'undefined' || typeof window.adsbygoogle?.push !== 'function') {
        if (attempt >= ADSENSE_RETRY_LIMIT) {
          setShowFallback(true);
          return;
        }

        timeoutRef.current = window.setTimeout(() => pushAd(attempt + 1), ADSENSE_RETRY_DELAY_MS);
        return;
      }

      try {
        adElement.dataset.adInitialized = 'true';
        window.adsbygoogle.push({});
        setShowFallback(false);
      } catch (error) {
        delete adElement.dataset.adInitialized;

        const message = error instanceof Error ? error.message.toLowerCase() : '';
        if (message.includes('all ins elements in the page with class=adsbygoogle already have ads')) {
          setShowFallback(false);
          return;
        }

        if (attempt >= ADSENSE_RETRY_LIMIT) {
          setShowFallback(true);
          return;
        }

        timeoutRef.current = window.setTimeout(() => pushAd(attempt + 1), ADSENSE_RETRY_DELAY_MS);
      }
    };

    pushAd();

    return () => {
      cancelled = true;
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [slotReadyForAds]);

  return (
    <aside
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`.trim()}
      aria-label={slotConfig.label}
    >
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Advertisement
      </div>
      <div
        className="relative w-full overflow-hidden rounded-md bg-slate-50"
        style={{ minHeight: `${slotConfig.minHeight}px` }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle block h-full w-full"
          style={{ display: 'block', minHeight: `${slotConfig.minHeight}px` }}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={slotConfig.slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-ad-layout="in-article"
          aria-describedby={showFallback ? fallbackId : undefined}
        />
        {showFallback && (
          <div
            id={fallbackId}
            className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-slate-500"
          >
            Ad space reserved. Replace the placeholder AdSense slot ID in `src/config/adsense.ts` after
            approval to serve production ads here.
          </div>
        )}
      </div>
    </aside>
  );
}
