'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, RefreshCcw, Camera, 
  Monitor, MonitorOff, Pencil, Trash2, X, Clock, ShieldAlert, User, AlertTriangle, Activity
} from 'lucide-react';
import { db, useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProgressPanel } from '@/components/shared/progress-panel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }],
};

export default function LiveLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const lessonId = String(params.lessonId);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenPreviewRef = useRef<HTMLVideoElement>(null);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [isTeacher, setIsTeacher] = useState<boolean | null>(null);
  const [childData, setChildData] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [debugStep, setDebugStep] = useState<string>("Sistem başlatılıyor...");
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showProgressPanel, setShowProgressPanel] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!db || !lessonId) return;
    const fetchLesson = async () => {
      const snap = await getDoc(doc(db, 'lesson-slots', lessonId));
      if (snap.exists()) {
        const data = snap.data();
        const endTime = new Date(data.startTime.toDate().getTime() + (data.packageCode === 'FREE_TRIAL' ? 30 : 45) * 60000);
        const interval = setInterval(() => {
          const diff = Math.floor((endTime.getTime() - Date.now()) / 1000);
          if (diff <= 0) { setTimeLeft(0); clearInterval(interval); } else setTimeLeft(diff);
        }, 1000);
        return () => clearInterval(interval);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const startMedia = useCallback(async () => {
    if (isInitializing || !user) return;
    setIsInitializing(true);
    setDebugStep("Kamera/Mikrofon isteniyor...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .catch(async () => {
           setDebugStep("Sadece mikrofon açılıyor...");
           return await navigator.mediaDevices.getUserMedia({ audio: true });
        });
      
      localStreamRef.current = stream;
      setHasPermission(true);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;
      stream.getTracks().forEach(t => pc.addTrack(t, stream));
      
      pc.ontrack = (e) => {
        setDebugStep("Görüntü alındı!");
        setRemoteStream(e.streams[0]);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
      };

      const lessonSnap = await getDoc(doc(db, 'lesson-slots', lessonId));
      if (!lessonSnap.exists()) {
        setDebugStep("Hata: Ders bulunamadı.");
        return;
      }
      
      const lessonData = lessonSnap.data();
      const roleIsTeacher = lessonData.teacherId === user.uid;
      setIsTeacher(roleIsTeacher);
      
      if (roleIsTeacher) {
        const childSnap = await getDoc(doc(db, 'users', lessonData.bookedBy, 'children', lessonData.childId));
        if (childSnap.exists()) setChildData({ ...childSnap.data(), id: childSnap.id });
      }

      const roomRef = doc(db, 'rooms', lessonId);

      if (roleIsTeacher) {
        setDebugStep("Oda kuruluyor (Öğretmen)...");
        await setDoc(roomRef, { createdAt: Timestamp.now(), teacherId: user.uid }, { merge: true });
        pc.onicecandidate = (e) => { if (e.candidate) addDoc(collection(roomRef, 'callerCandidates'), e.candidate.toJSON()); };
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await updateDoc(roomRef, { offer: { type: offer.type, sdp: offer.sdp }, answer: null });

        onSnapshot(roomRef, async (s) => {
          const data = s.data();
          if (data?.answer && !pc.currentRemoteDescription) {
            setDebugStep("Veli katıldı, bağlanıyor...");
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
        });
        onSnapshot(collection(roomRef, 'calleeCandidates'), (s) => s.docChanges().forEach(c => { if (c.type === 'added') pc.addIceCandidate(new RTCIceCandidate(c.doc.data())); }));
      } else {
        setDebugStep("Öğretmen bekleniyor...");
        onSnapshot(roomRef, async (s) => {
          const data = s.data();
          if (data?.offer && !pc.currentRemoteDescription) {
            setDebugStep("Öğretmen bulundu, el sıkışılıyor...");
            pc.onicecandidate = (e) => { if (e.candidate) addDoc(collection(roomRef, 'calleeCandidates'), e.candidate.toJSON()); };
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });
          }
        });
        onSnapshot(collection(roomRef, 'callerCandidates'), (s) => s.docChanges().forEach(c => { if (c.type === 'added') pc.addIceCandidate(new RTCIceCandidate(c.doc.data())); }));
      }

    } catch (err: any) {
      console.error(err);
      setHasPermission(false);
      setDebugStep("Hata: " + err.message);
    } finally {
      setIsInitializing(false);
    }
  }, [lessonId, user]);

  useEffect(() => { if (isMounted && user) startMedia(); }, [isMounted, user, startMedia]);

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
        const videoTrack = localStreamRef.current?.getVideoTracks()[0];
        const sender = pcRef.current?.getSenders().find(s => s.track?.kind === 'video');
        if (sender && videoTrack) sender.replaceTrack(videoTrack);
        screenStreamRef.current?.getTracks().forEach(t => t.stop());
        setIsScreenSharing(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStreamRef.current = stream;
            const sender = pcRef.current?.getSenders().find(s => s.track?.kind === 'video');
            if (sender) sender.replaceTrack(stream.getVideoTracks()[0]);
            setIsScreenSharing(true);
            if (screenPreviewRef.current) screenPreviewRef.current.srcObject = stream;
            stream.getVideoTracks()[0].onended = () => setIsScreenSharing(false);
        } catch (e) { console.error(e); }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 z-50 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-bold text-[10px] uppercase tracking-widest text-red-500">Canlı Yayında</span>
          </div>
          {timeLeft !== null && (
            <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full font-mono text-sm font-bold transition-all", timeLeft <= 300 ? "bg-red-500/20 text-red-500 animate-pulse border border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20")}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
          
          {/* DEBUG PANEL: Sadece geliştirme sırasında görmek için */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full text-[10px] text-slate-400 border border-white/5">
             <Activity size={12}/> {debugStep}
          </div>
        </div>
        <div className="text-[10px] opacity-40 font-mono tracking-widest uppercase">{isTeacher ? 'Öğretmen' : 'Veli'}</div>
      </div>

      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <div className="w-full h-full relative flex items-center justify-center bg-[#08080a]">
          {isScreenSharing ? ( <video ref={screenPreviewRef} autoPlay playsInline muted className="w-full h-full object-contain" /> ) : ( <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-contain" /> )}
          {!remoteStream && !isScreenSharing && (
             <div className="flex flex-col items-center gap-6 text-slate-700">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center animate-pulse">
                   <User size={40} className="opacity-20"/>
                </div>
                <div className="text-center space-y-1">
                   <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40">Bağlantı Kuruluyor</p>
                   <p className="text-[9px] text-slate-600 italic">Lütfen karşı tarafın derse katılmasını bekleyin...</p>
                </div>
             </div>
          )}
        </div>
        <div className={cn("absolute w-52 h-36 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl bg-slate-900 z-30 transition-all duration-700 ring-8 ring-black/10", isTeacher ? "bottom-8 right-8" : "top-8 right-8")}>
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">Siz</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="px-6 py-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-center gap-6 z-50">
        <Button variant="ghost" size="icon" className={cn("rounded-2xl h-12 w-12 transition-all", isMicOn ? "bg-slate-800 text-slate-300" : "bg-red-500 text-white shadow-lg")} onClick={() => {
            const track = localStreamRef.current?.getAudioTracks()[0];
            if(track) { track.enabled = !isMicOn; setIsMicOn(!isMicOn); }
        }}>{isMicOn ? <Mic size={20} /> : <MicOff size={20} />}</Button>
        
        <Button variant="ghost" size="icon" className={cn("rounded-2xl h-12 w-12 transition-all", isVideoOn ? "bg-slate-800 text-slate-300" : "bg-red-500 text-white shadow-lg")} onClick={() => {
            const track = localStreamRef.current?.getVideoTracks()[0];
            if(track) { track.enabled = !isVideoOn; setIsVideoOn(!isVideoOn); }
        }}>{isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}</Button>
        
        {isTeacher && (
          <>
            <div className="w-px h-8 bg-slate-800 mx-2" />
            <Button variant="ghost" size="icon" className={cn("rounded-2xl h-12 w-12 shadow-lg", isScreenSharing ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300")} onClick={toggleScreenShare}><Monitor size={20} /></Button>
            <div className="w-px h-8 bg-slate-800 mx-2" />
            <Button variant="destructive" size="icon" className="rounded-2xl h-12 w-12 shadow-xl hover:scale-105 transition-transform" onClick={() => setShowExitConfirm(true)}><PhoneOff size={20} /></Button>
          </>
        )}
      </div>

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-white rounded-[32px]">
          <AlertDialogHeader><AlertDialogTitle>Dersi bitiriyor musunuz?</AlertDialogTitle><AlertDialogDescription className="text-slate-400 text-sm">Dersi sonlandırdığınızda değerlendirme paneli açılacaktır.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 rounded-xl">Vazgeç</AlertDialogCancel><AlertDialogAction onClick={() => { setShowExitConfirm(false); setShowProgressPanel(true); }} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">Dersi Bitir</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showProgressPanel} onOpenChange={(open) => !open && router.push('/ogretmen-portali/derslerim')}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 bg-slate-50 overflow-hidden rounded-[32px]">
          <DialogHeader className="p-6 bg-white border-b"><DialogTitle className="text-2xl font-bold text-slate-900">Ders Değerlendirmesi</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">{childData && <ProgressPanel child={childData} lessonId={lessonId} isEditable={true} />}</div>
          <div className="p-4 bg-white border-t flex justify-end gap-4"><Button onClick={() => router.push('/ogretmen-portali/derslerim')} className="bg-slate-900 text-white rounded-xl px-8 font-bold">Kaydet ve Çık</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
