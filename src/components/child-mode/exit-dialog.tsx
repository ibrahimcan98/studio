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
      inputRefs.current[0]?.focus();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setError('');

      // Move to next input
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
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pasteData)) {
      const newPin = pasteData.split('');
      setPin(newPin);
      inputRefs.current[3]?.focus();
    }
  };


  const handleVerify = () => {
    setIsVerifying(true);
    setError('');
    const enteredPin = pin.join('');
    
    // Simulate verification
    setTimeout(() => {
        const storedPin = localStorage.getItem(`child-pin-${childId}`);

        if (enteredPin === storedPin) {
            toast({
                title: 'Başarılı!',
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
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Çıkış Yap</DialogTitle>
          <DialogDescription>
            Çocuk modundan çıkmak için lütfen ebeveyn PIN kodunu girin.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
           <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {pin.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                id={`pin-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold"
                pattern="\d*"
                disabled={isVerifying}
              />
            ))}
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isVerifying}>
            İptal
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying || pin.join('').length < 4}>
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Doğrula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
