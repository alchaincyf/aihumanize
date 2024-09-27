// @ts-nocheck

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface LangLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export default function LangLayout({ children, params }: LangLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    if (!['en', 'zh'].includes(params.lang)) {
      router.replace('/zh');
    }
  }, [params.lang, router]);

  return children;
}