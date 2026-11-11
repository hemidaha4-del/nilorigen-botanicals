'use client';

import { useEffect, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { arContent } from '@/content/ar';
import { enContent } from '@/content/en';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISSED_KEY = 'nilorigen-install-prompt-dismissed';

export const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && Boolean(navigator.standalone));

    if (isStandalone) return;

    const userAgent = window.navigator.userAgent;
    const isAppleMobile = /iPhone|iPad|iPod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(isAppleMobile);
    setIsDismissed(window.sessionStorage.getItem(DISMISSED_KEY) === 'true');

    const updateLanguage = () => {
      setIsArabic(document.documentElement.lang.toLowerCase().startsWith('ar'));
    };
    updateLanguage();

    const languageObserver = new MutationObserver(updateLanguage);
    languageObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      if (window.sessionStorage.getItem(DISMISSED_KEY) !== 'true') {
        setInstallPrompt(event as InstallPromptEvent);
      }
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }

    return () => {
      languageObserver.disconnect();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const dismissPrompt = () => {
    setIsDismissed(true);
    window.sessionStorage.setItem(DISMISSED_KEY, 'true');
  };

  const handleInstall = async () => {
    if (!installPrompt) {
      setShowIOSInstructions(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === 'accepted') setIsDismissed(true);
  };

  const visible = !isDismissed && (installPrompt !== null || isIOS);
  if (!visible) return null;

  const copy = isArabic ? arContent.pwa : enContent.pwa;

  return (
    <aside
      role="region"
      aria-label={copy.title}
      className="fixed inset-x-4 bottom-20 z-[90] mx-auto flex max-w-lg items-start gap-3 rounded-md border border-gold/35 bg-darkgreen p-4 text-offwhite shadow-xl sm:inset-x-auto sm:start-5 sm:bottom-5 sm:mx-0"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-gold/10 text-gold">
        {isIOS && !installPrompt ? (
          <Share2 aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Download aria-hidden="true" className="h-5 w-5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{copy.title}</p>
        <p className="mt-1 text-xs leading-5 text-offwhite/70">{copy.description}</p>
        {showIOSInstructions && (
          <p className="mt-2 text-xs font-medium leading-5 text-gold">{copy.installInstructions}</p>
        )}
        <button
          type="button"
          onClick={handleInstall}
          className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-gold px-4 py-2 text-xs font-bold text-darkgreen transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-darkgreen"
        >
          {isIOS && !installPrompt ? copy.installHelp : copy.install}
        </button>
      </div>
      <button
        type="button"
        onClick={dismissPrompt}
        aria-label={copy.close}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-offwhite/65 transition-colors hover:bg-white/10 hover:text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </aside>
  );
};