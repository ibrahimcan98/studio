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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function ExitDialog({ children, childId }: { children: React.ReactNode, childId: string }) {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      setPin(['', '', '', '']);
      setError('');
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setError('');

      if (value !== '' && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setError('');
    const enteredPin = pin.join('');
    const storedPin = localStorage.getItem(`child-pin-${childId}`);

    if (enteredPin === storedPin) {
        toast({
            title: 'Görüşmek Üzere!',
            description: 'Ebeveyn portalına yönlendiriliyorsunuz.',
        });
        localStorage.removeItem(`child-pin-${childId}`);
        router.push('/ebeveyn-portali');
        setOpen(false);
    } else {
        setError('PIN kodu yanlış. Lütfen tekrar deneyin.');
        setPin(['', '', '', '']);
        inputRefs.current[0]?.focus();
    }
    setIsVerifying(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[32px]">
        <DialogHeader>
          <DialogTitle>Çıkış Yap</DialogTitle>
          <DialogDescription>
            Çocuk modundan çıkmak için lütfen ebeveyn PIN kodunu girin.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
           <div className="flex justify-center gap-2">
            {pin.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                id={`exit-pin-${index}`}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl"
                pattern="\d*"
                disabled={isVerifying}
                autoComplete="off"
              />
            ))}
          </div>
          {error && <p className="text-destructive text-sm font-medium">{error}</p>}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isVerifying} className="rounded-xl">
            İptal
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying || pin.join('').length < 4} className="rounded-xl font-bold">
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Doğrula ve Çık
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
