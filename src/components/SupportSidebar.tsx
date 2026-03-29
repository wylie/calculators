import { memo, useEffect, useRef, useState } from 'react';

interface SupportSidebarProps {
  siteName?: string;
}

function SupportSidebarBase({ siteName = 'Simple Calculators' }: SupportSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Keep this client-only to avoid SSR hydration mismatches from third-party DOM mutations.
    if (container.querySelector('script[data-name="bmc-button"], .bmc-btn-container')) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'Wylie');
    script.setAttribute('data-color', '#ffb703');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Cookie');
    script.setAttribute('data-text', 'Buy me a tea');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#FFDD00');
    script.onerror = () => setShowFallback(true);
    container.appendChild(script);

    const timer = window.setTimeout(() => {
      const hasRenderedEmbed =
        !!container.querySelector('.bmc-btn-container, iframe, [class*="bmc"]') ||
        Array.from(container.children).some((node) => {
          const element = node as HTMLElement;
          return element.tagName !== 'SCRIPT';
        });
      if (!hasRenderedEmbed) {
        setShowFallback(true);
      }
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <aside className="mt-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm" aria-label={`Support ${siteName}`}>
      <h3 className="text-[1.05rem] font-semibold text-slate-900">Support {siteName}</h3>
      <p className="mt-2 text-sm text-slate-600">Enjoying the calculators? You can support future updates here.</p>
      <div
        ref={containerRef}
        className={showFallback ? 'hidden' : 'mt-2 flex min-h-[44px] items-center justify-center'}
        suppressHydrationWarning
      />
      {showFallback && (
        <div className="mt-2 flex items-center justify-center">
          <button
            type="button"
            onClick={() => window.open('https://www.buymeacoffee.com/Wylie', '_blank', 'noopener,noreferrer')}
            className="inline-flex items-center justify-center rounded-xl border border-amber-500 bg-amber-400 px-5 py-1.5 text-black shadow-sm"
            style={{ fontFamily: "'Cookie', cursive", fontSize: '2.1rem', lineHeight: 1 }}
          >
            <span className="mr-2 text-[1.5rem]" aria-hidden="true">☕</span>
            Buy me a tea
          </button>
        </div>
      )}
    </aside>
  );
}

const SupportSidebar = memo(SupportSidebarBase);
export default SupportSidebar;
