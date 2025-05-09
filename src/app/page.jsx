'use client';

import { Suspense } from 'react';
import ClientPage from './ClientPage.js';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientPage />
    </Suspense>
  );
}
