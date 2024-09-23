'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LangLayout({ children, params }) {
  const router = useRouter();

  useEffect(() => {
    if (!['en', 'zh'].includes(params.lang)) {
      router.replace('/zh');
    }
  }, [params.lang, router]);

  return children;
}