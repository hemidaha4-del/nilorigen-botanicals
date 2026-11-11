'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, LockKeyhole } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result: unknown = await response.json();
        const message =
          typeof result === 'object' && result !== null && 'error' in result && typeof result.error === 'string'
            ? result.error
            : 'Unable to sign in.';
        throw new Error(message);
      }

      const destination = new URLSearchParams(window.location.search).get('from');
      router.replace(destination?.startsWith('/admin') ? destination : '/admin');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#073B2A] px-4 py-12 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_55%)]" />
      <section className="relative w-full max-w-md rounded-2xl border border-[#D4AF37]/25 bg-[#062F22]/90 p-7 shadow-2xl backdrop-blur sm:p-10">
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Leaf aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="font-english text-sm font-bold tracking-[0.24em] text-[#D4AF37]">NILORIGEN</p>
          <p className="mt-1 font-english text-[10px] tracking-[0.3em] text-white/55">BOTANICALS</p>
          <h1 className="mt-8 text-2xl font-semibold">Admin Sign In</h1>
          <p className="mt-2 text-sm text-white/60">Secure access to newsletter management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-white/80">
            Username
            <input
              autoComplete="username"
              required
              maxLength={200}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-[#073B2A] px-4 text-sm text-white outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </label>
          <label className="block text-sm text-white/80">
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              maxLength={1024}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-lg border border-white/15 bg-[#073B2A] px-4 text-sm text-white outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
          </label>

          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-5 text-sm font-bold text-[#073B2A] transition hover:bg-[#e2c35d] disabled:cursor-wait disabled:opacity-70"
          >
            <LockKeyhole aria-hidden="true" className="h-4 w-4" />
            {isSubmitting ? 'Signing in…' : 'Sign in securely'}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-white/45">Nilorigen Botanicals · Cairo, Egypt</p>
      </section>
    </main>
  );
}
