'use client';

import { useParams } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ExitDialog } from "@/components/child-mode/exit-dialog";

export function GlobalChildExitButton() {
  const params = useParams();
  const childId = params.childId as string;

  if (!childId) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
      <ExitDialog childId={childId}>
        <Button 
          size="icon" 
          className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[24px] bg-red-500 hover:bg-red-600 text-white shadow-2xl border-b-4 border-red-700 hover:translate-y-0.5 active:translate-y-1 transition-all"
          title="Çıkış"
        >
          <LogOut className="w-6 h-6 md:w-8 md:h-8" />
        </Button>
      </ExitDialog>
    </div>
  );
}
