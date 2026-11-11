'use client';

import { useEffect, useState } from 'react';
import { Loader2, Wifi } from 'lucide-react';

const SLOW_REQUEST_DELAY_MS = 3000;
const TOAST_DURATION_MS = 4000;

export const GlobalFetchFeedback = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [slowRequestCount, setSlowRequestCount] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const originalFetch = window.fetch;
    const slowRequests = new Set<number>();
    const delayTimers = new Set<number>();
    let nextRequestId = 0;
    let pendingRequests = 0;
    let toastTimer: number | undefined;
    let isActive = true;

    const updateLanguage = () => {
      setIsArabic(document.documentElement.lang.toLowerCase().startsWith('ar'));
    };

    updateLanguage();
    const languageObserver = new MutationObserver(updateLanguage);
    languageObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    const monitoredFetch: typeof window.fetch = (...args) => {
      const requestId = nextRequestId++;
      let isSlowRequest = false;
      pendingRequests += 1;
      setPendingCount(pendingRequests);

      const delayTimer = window.setTimeout(() => {
        delayTimers.delete(delayTimer);
        if (!isActive) return;

        isSlowRequest = true;
        slowRequests.add(requestId);
        setSlowRequestCount(slowRequests.size);
        setToastVisible(true);

        if (toastTimer !== undefined) {
          window.clearTimeout(toastTimer);
          toastTimer = undefined;
        }
      }, SLOW_REQUEST_DELAY_MS);
      delayTimers.add(delayTimer);

      let request: ReturnType<typeof originalFetch>;
      try {
        request = originalFetch.apply(window, args);
      } catch (error) {
        window.clearTimeout(delayTimer);
        delayTimers.delete(delayTimer);
        pendingRequests -= 1;
        setPendingCount(pendingRequests);
        throw error;
      }

      return request.finally(() => {
        window.clearTimeout(delayTimer);
        delayTimers.delete(delayTimer);
        pendingRequests -= 1;
        if (!isActive) return;

        setPendingCount(pendingRequests);
        if (isSlowRequest) {
          slowRequests.delete(requestId);
          setSlowRequestCount(slowRequests.size);
          if (slowRequests.size === 0) {
            toastTimer = window.setTimeout(() => {
              toastTimer = undefined;
              if (isActive && slowRequests.size === 0) setToastVisible(false);
            }, TOAST_DURATION_MS);
          }
        }
      });
    };

    window.fetch = monitoredFetch;

    return () => {
      isActive = false;
      languageObserver.disconnect();
      delayTimers.forEach((timer) => window.clearTimeout(timer));
      if (toastTimer !== undefined) window.clearTimeout(toastTimer);
      if (window.fetch === monitoredFetch) window.fetch = originalFetch;
    };
  }, []);

  const showSpinner = pendingCount > 0 && slowRequestCount === 0 && !toastVisible;

  return (
    <>
      {showSpinner && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 end-5 z-[100] flex items-center gap-3 rounded-md border border-gold/30 bg-darkgreen/95 px-4 py-3 text-sm text-offwhite shadow-lg backdrop-blur"
        >
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-gold" />
          <span>{isArabic ? 'جارٍ التحميل...' : 'Loading...'}</span>
        </div>
      )}

      {toastVisible && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-5 end-5 z-[100] flex max-w-sm items-start gap-3 rounded-md border border-gold/40 bg-darkgreen px-4 py-3 text-offwhite shadow-xl animate-fade-in"
        >
          <Wifi aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <div>
            <p className="text-sm font-semibold">
              {isArabic ? 'يستغرق الطلب وقتًا أطول من المعتاد' : 'This request is taking longer than usual'}
            </p>
            <p className="mt-1 text-xs leading-5 text-offwhite/75">
              {isArabic
                ? 'قد يكون اتصالك بالإنترنت بطيئًا. يرجى الانتظار.'
                : 'Your connection may be slow. Please wait.'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};