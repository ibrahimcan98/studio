'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function SetPinDialog({ children, childId }: { children: React.ReactNode, childId: string }) {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isSetting, setIsSetting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      pinInputRefs.current[0]?.focus();
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setError('');
    }
  }, [open]);

  const createInputHandler = (
    currentPin: string[],
    setPinState: React.Dispatch<React.SetStateAction<string[]>>,
    nextInputRef?: HTMLInputElement | null
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const { value } = e.target;
      if (/^[0-9]$/.test(value) || value === '') {
        const newPin = [...currentPin];
        newPin[index] = value;
        setPinState(newPin);
        setError('');

        if (value !== '' && index < 3) {
            const inputRefs = setPinState === setPin ? pinInputRefs : confirmPinInputRefs;
            inputRefs.current[index + 1]?.focus();
        } else if (value !== '' && index === 3 && nextInputRef) {
            nextInputRef.focus();
        }
      }
    };
  };

  const createKeyDownHandler = (
    currentPin: string[],
    setPinState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    return (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        const inputRefs = setPinState === setPin ? pinInputRefs : confirmPinInputRefs;
        if (e.key === 'Backspace' && currentPin[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
  };

  const handleSetPin = () => {
    const pinStr = pin.join('');
    const confirmPinStr = confirmPin.join('');

    if (pinStr.length !== 4 || confirmPinStr.length !== 4) {
      setError('Lütfen 4 haneli bir PIN kodu girin.');
      return;
    }

    if (pinStr !== confirmPinStr) {
      setError('PIN kodları eşleşmiyor. Lütfen tekrar deneyin.');
      setConfirmPin(['', '', '', '']);
      confirmPinInputRefs.current[0]?.focus();
      return;
    }

    setIsSetting(true);
    setError('');

    setTimeout(() => {
        localStorage.setItem(`child-pin-${childId}`, pinStr);
        toast({
            title: 'PIN Ayarlandı!',
            description: 'Çocuk modu başlatılıyor...',
        });
        router.push(`/cocuk-modu/${childId}`);
        setOpen(false);
        setIsSetting(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Çocuk Modu PIN Ayarla</DialogTitle>
          <DialogDescription>
            Çocuk modundan çıkmak için kullanılacak 4 haneli bir PIN kodu belirleyin.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className='space-y-2'>
            <Label htmlFor='pin-0'>PIN Kodu</Label>
            <div className="flex justify-center gap-2">
                {pin.map((digit, index) => (
                <Input
                    key={`pin-${index}`}
                    ref={el => { pinInputRefs.current[index] = el; }}
                    id={`pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => createInputHandler(pin, setPin, confirmPinInputRefs.current[0])(e, index)}
                    onKeyDown={(e) => createKeyDownHandler(pin, setPin)(e, index)}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    pattern="\d*"
                    autoComplete="off"
                    disabled={isSetting}
                />
                ))}
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirm-pin-0'>PIN Kodunu Doğrula</Label>
            <div className="flex justify-center gap-2">
                {confirmPin.map((digit, index) => (
                <Input
                    key={`confirm-pin-${index}`}
                    ref={el => { confirmPinInputRefs.current[index] = el; }}
                    id={`confirm-pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => createInputHandler(confirmPin, setConfirmPin)(e, index)}
                    onKeyDown={(e) => createKeyDownHandler(confirmPin, setConfirmPin)(e, index)}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    pattern="\d*"
                    autoComplete="off"
                    disabled={isSetting}
                />
                ))}
            </div>
          </div>
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSetting}>
            İptal
          </Button>
          <Button onClick={handleSetPin} disabled={isSetting}>
            {isSetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            PIN Ayarla ve Başla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
