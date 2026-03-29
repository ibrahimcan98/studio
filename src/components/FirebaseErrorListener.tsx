'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It shows a toast notification instead of throwing to prevent app crashes.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error("Firestore Permission Error handled globally:", error);
      
      toast({
        variant: 'destructive',
        title: 'Erişim Engellendi',
        description: `Bu işlemi gerçekleştirmek için yetkiniz yok. (Dosya: ${error.path || 'Bilinmiyor'}, İşlem: ${error.operation || 'Bilinmiyor'})`,
        duration: 5000,
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
