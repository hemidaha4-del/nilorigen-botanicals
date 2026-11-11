import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-darkgreen text-offwhite flex flex-col items-center justify-center p-6 text-center">
      <span className="text-7xl sm:text-9xl font-extrabold text-gold tracking-widest font-english">
        404
      </span>
      <h1 className="mt-4 text-2xl sm:text-3xl font-bold">
        الصفحة غير موجودة | Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-offwhite/75 leading-relaxed">
        عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
        <br />
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 rounded-full bg-gold text-darkgreen font-bold text-sm hover:bg-gold-light transition-all shadow-lg hover:shadow-gold/25"
      >
        العودة للرئيسية | Return Home
      </Link>
    </main>
  );
}
