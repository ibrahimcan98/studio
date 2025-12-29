'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Video, VideoOff, PhoneOff, RefreshCcw, Camera } from 'lucide-react';
import { db } from '@/firebase';
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

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

function AttachCreatedAt(roomSnap: any) {
  if (!roomSnap.exists()) {
    return { createdAt: Timestamp.now() };
  }
  return {};
}

export default function LiveLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const lessonId = String(params.lessonId);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const startMedia = useCallback(async () => {
    if (isInitializing) return;
    setIsInitializing(true);
    setErrorType(null);

    try {
      // Kamera ve mikrofonu açmaya çalış
      const localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = localStream;
      setHasPermission(true);
      setIsMicOn(true);
      setIsVideoOn(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // WebRTC kurulumu
      const pc = new RTCPeerConnection(rtcConfig);
      pcRef.current = pc;

      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      const roomRef = doc(db, 'rooms', lessonId);
      const roomSnap = await getDoc(roomRef);
      const isCaller = !roomSnap.exists() || !roomSnap.data()?.offer;

      if (isCaller) {
        await setDoc(roomRef, AttachCreatedAt(roomSnap), { merge: true });
        const callerCandidatesRef = collection(roomRef, 'callerCandidates');
        pc.onicecandidate = async (event) => {
          if (event.candidate) await addDoc(callerCandidatesRef, event.candidate.toJSON());
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await updateDoc(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });

        onSnapshot(roomRef, async (snap) => {
          const data = snap.data();
          if (data?.answer && !pc.currentRemoteDescription) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
        });

        const calleeCandidatesRef = collection(roomRef, 'calleeCandidates');
        onSnapshot(calleeCandidatesRef, (snap) => {
          snap.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              await pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
            }
          });
        });

      } else {
        const calleeCandidatesRef = collection(roomRef, 'calleeCandidates');
        pc.onicecandidate = async (event) => {
          if (event.candidate) await addDoc(calleeCandidatesRef, event.candidate.toJSON());
        };

        const roomData = roomSnap.data();
        await pc.setRemoteDescription(new RTCSessionDescription(roomData.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });

        const callerCandidatesRef = collection(roomRef, 'callerCandidates');
        onSnapshot(callerCandidatesRef, (snap) => {
          snap.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              await pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
            }
          });
        });
      }

    } catch (error: any) {
      console.error("Media Error:", error);
      setHasPermission(false);
      
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setErrorType('DEVICE_NOT_FOUND');
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorType('PERMISSION_DENIED');
      } else {
        setErrorType('UNKNOWN');
      }

      toast({
        variant: 'destructive',
        title: 'Cihaz Erişimi Hatası',
        description: 'Kamera veya mikrofon bulunamadı veya erişim engellendi.',
      });
    } finally {
      setIsInitializing(false);
    }
  }, [lessonId, toast, isInitializing]);

  useEffect(() => {
    startMedia();
    return () => {
      if (pcRef.current) pcRef.current.close();
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []); // Only once on mount

  const toggleMic = () => {
    if (!localStreamRef.current) {
      startMedia(); // Eğer kapalıysa açmayı dene
      return;
    }
    const track = localStreamRef.current.getAudioTracks()[0];
    if (track) {
      track.enabled = !isMicOn;
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) {
      startMedia(); // Eğer kapalıysa açmayı dene
      return;
    }
    const track = localStreamRef.current.getVideoTracks()[0];
    if (track) {
      track.enabled = !isVideoOn;
      setIsVideoOn(!isVideoOn);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 text-white p-4">
      <Card className="w-full max-w-5xl h-[85vh] flex flex-col bg-slate-900 border-slate-800 shadow-2xl overflow-hidden">
        <CardContent className="relative flex-1 flex items-center justify-center p-0 bg-black">
          {/* Ana Görüntü (Uzak) */}
          <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
          
          {/* Kendi Görüntüm (Yerel) */}
          <div className="absolute bottom-6 right-6 w-48 h-36 rounded-xl border-2 border-white/20 overflow-hidden shadow-lg bg-slate-800">
            {isVideoOn ? (
              <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <VideoOff className="w-10 h-10 text-slate-500" />
              </div>
            )}
          </div>

          {/* Hata Durumları */}
          {hasPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 z-10 p-6 text-center">
              <div className="max-w-md space-y-6">
                <div className="bg-red-500/20 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Camera className="w-10 h-10 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">
                    {errorType === 'DEVICE_NOT_FOUND' ? 'Kamera veya Mikrofon Bulunamadı' : 'Erişim İzni Verilmedi'}
                  </h3>
                  <p className="text-slate-400">
                    {errorType === 'DEVICE_NOT_FOUND' 
                      ? 'Lütfen cihazınızın kamera ve mikrofonunun bağlı olduğundan emin olun.' 
                      : 'Tarayıcı ayarlarından kamera ve mikrofon izinlerini etkinleştirmeniz gerekmektedir.'}
                  </p>
                </div>
                <Button onClick={startMedia} disabled={isInitializing} className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full font-bold">
                  {isInitializing ? <Loader2 className="animate-spin mr-2" /> : <RefreshCcw className="mr-2 h-5 w-5" />}
                  Tekrar Dene
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Kontrol Çubuğu */}
        <div className="flex items-center justify-center gap-6 p-6 bg-slate-900 border-t border-slate-800">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-14 w-14 transition-all duration-300",
              isMicOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
            )}
            onClick={toggleMic}
          >
            {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full h-14 w-14 transition-all duration-300",
              isVideoOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
            )}
            onClick={toggleVideo}
          >
            {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform"
            onClick={() => router.back()}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Yardımcı Loader bileşeni (Lucide'den gelmediyse diye)
function Loader2({ className }: { className?: string }) {
  return <RefreshCcw className={cn("animate-spin", className)} />;
}
