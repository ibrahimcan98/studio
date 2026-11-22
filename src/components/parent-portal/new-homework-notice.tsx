'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { SetPinDialog } from '@/components/child-mode/set-pin-dialog';
import { collectHomeworkNotices, unseenHomeworkNotices, type HomeworkNotice } from '@/lib/homework-notice';

export function NewHomeworkNotice({ userId, seenKeys, childrenData, slots }: { userId: string; seenKeys?: string[]; childrenData: any[]; slots: any[] }) {
  const db = useFirestore();
  const router = useRouter();
  const homeworksQuery = useMemoFirebase(() => db ? query(collection(db, 'game-homeworks'), where('parentId', '==', userId)) : null, [db, userId]);
  const { data: homeworks, isLoading, error } = useCollection(homeworksQuery);
  const [open, setOpen] = useState(false);
  const [displayed, setDisplayed] = useState<HomeworkNotice[]>([]);
  const [pinChildId, setPinChildId] = useState<string | null>(null);
  const sessionSeen = useRef(new Set<string>());
  const notices = useMemo(() => collectHomeworkNotices(homeworks || [], childrenData, slots), [homeworks, childrenData, slots]);

  useEffect(() => {
    if (!db || isLoading || error || !homeworks || open || pinChildId) return;
    const storageKey = `homework-notices-seen:${userId}`;
    let cached: string[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(parsed)) cached = parsed.filter(item => typeof item === 'string');
    } catch { /* Account state below remains authoritative if storage is unavailable. */ }
    const seen = new Set([...(Array.isArray(seenKeys) ? seenKeys : []), ...cached, ...sessionSeen.current]);
    const unseen = unseenHomeworkNotices(notices, seen);
    if (!unseen.length) return;
    unseen.forEach(notice => { seen.add(notice.key); sessionSeen.current.add(notice.key); });
    setDisplayed(unseen);
    setOpen(true);
    try { localStorage.setItem(storageKey, JSON.stringify([...seen])); } catch { /* Keep the in-memory fallback. */ }
    // Mark the notification as shown, without changing the homework's completion state.
    void updateDoc(doc(db, 'users', userId), { seenHomeworkNotifications: arrayUnion(...unseen.map(notice => notice.key)) })
      .catch(() => console.warn('Ödev bildirimi görüldü bilgisi hesaba kaydedilemedi; cihaz kaydı korundu.'));
  }, [db, userId, homeworks, isLoading, error, notices, seenKeys, open, pinChildId]);

  const goToHomework = (notice: HomeworkNotice) => {
    setOpen(false);
    if (notice.kind === 'file') { router.push('/ebeveyn-portali/dersler'); return; }
    let hasPin = false;
    try { hasPin = !!localStorage.getItem(`child-pin-${notice.childId}`); } catch { /* Let the existing PIN dialog handle entry. */ }
    if (hasPin) router.push(`/cocuk-modu/${encodeURIComponent(notice.childId)}`);
    else setPinChildId(notice.childId);
  };

  return <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="pr-5 text-xl">📝 Yeni ödeviniz var!</DialogTitle>
          <DialogDescription>Çocuğunuz için yeni etkinlikler atandı. Başlamak için ilgili ödevi seçin.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {displayed.map(notice => <div key={notice.key} className="min-w-0 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="break-words text-sm font-bold text-slate-900">{notice.childName}</p>
            <p className="mt-1 break-words text-sm text-slate-700">{notice.title}</p>
            <p className="mt-1 text-xs text-slate-500">{notice.category}</p>
            <Button className="mt-3 min-h-11 w-full sm:w-auto" onClick={() => goToHomework(notice)}>Ödeve Git</Button>
          </div>)}
        </div>
        <DialogFooter><Button variant="outline" className="min-h-11" onClick={() => setOpen(false)}>Daha Sonra</Button></DialogFooter>
      </DialogContent>
    </Dialog>
    {pinChildId && <SetPinDialog childId={pinChildId} open onOpenChange={value => { if (!value) setPinChildId(null); }} />}
  </>;
}
