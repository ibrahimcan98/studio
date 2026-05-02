'use client';

import { GlobalChildExitButton } from '@/components/child-mode/global-exit-button';

export default function ChildIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <GlobalChildExitButton />
    </>
  );
}
