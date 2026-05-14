import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: 'true' | 'false';
  className?: string;
}

/**
 * Reusable Google AdSense component.
 * Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your real publisher ID.
 */
export const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto', responsive = 'true', className = '' }) => {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const pushAd = () => {
      try {
        const adElement = adRef.current;
        if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
          // Verify container has width to avoid "No slot size for availableWidth=0"
          const width = adElement.parentElement?.offsetWidth || 0;
          if (width > 0) {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            initialized.current = true;
          } else {
            // If No width yet, retry in short interval
            setTimeout(pushAd, 200);
          }
        }
      } catch (e) {
        console.error("AdSense error:", e);
      }
    };

    // Use interaction observer or small delay to ensure layout is ready
    const timer = setTimeout(pushAd, 150);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`ad-container relative my-8 overflow-hidden bg-stone-50 rounded-lg flex items-center justify-center min-h-[100px] border border-stone-100 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      {/* Placeholder for development / transparent fallback */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Advertisement Slot</span>
      </div>
    </div>
  );
};
