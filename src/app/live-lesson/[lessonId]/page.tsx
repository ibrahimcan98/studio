'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { db } from '@/firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

// Firestore doc yoksa createdAt eklemek için küçük helper
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
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    let unsubscribeRoom: (() => void) | null = null;
    let unsubscribeAnswer: (() => void) | null = null;
    let unsubscribeRemoteCandidates: (() => void) | null = null;

    const start = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = localStream;
        setHasPermission(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        const pc = new RTCPeerConnection(rtcConfig);
        pcRef.current = pc;

        // Local tracks
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        // Remote tracks
        pc.ontrack = (event) => {
          const [remoteStream] = event.streams;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        const roomRef = doc(db, 'rooms', lessonId);
        const roomSnap = await getDoc(roomRef);

        // Caller mı Callee mi?
        const isCaller = !roomSnap.exists() || !roomSnap.data()?.offer;

        if (isCaller) {
          await setDoc(roomRef, AttachCreatedAt(roomSnap), { merge: true });

          const callerCandidatesRef = collection(roomRef, 'callerCandidates');
          pc.onicecandidate = async (event) => {
            if (event.candidate) {
              await addDoc(callerCandidatesRef, event.candidate.toJSON());
            }
          };

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          await updateDoc(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });

          // Answer bekle
          unsubscribeAnswer = onSnapshot(roomRef, async (snap) => {
            const data = snap.data();
            if (!data) return;
            if (data.answer && !pc.currentRemoteDescription) {
              const answerDesc = new RTCSessionDescription(data.answer);
              await pc.setRemoteDescription(answerDesc);
            }
          });

          // Callee candidates dinle
          const calleeCandidatesRef = collection(roomRef, 'calleeCandidates');
          unsubscribeRemoteCandidates = onSnapshot(calleeCandidatesRef, (snap) => {
            snap.docChanges().forEach(async (change) => {
              if (change.type === 'added') {
                const cand = new RTCIceCandidate(change.doc.data());
                await pc.addIceCandidate(cand);
              }
            });
          });

        } else {
          // Callee
          const calleeCandidatesRef = collection(roomRef, 'calleeCandidates');
          pc.onicecandidate = async (event) => {
            if (event.candidate) {
              await addDoc(calleeCandidatesRef, event.candidate.toJSON());
            }
          };

          const roomData = roomSnap.data();
          const offerDesc = new RTCSessionDescription(roomData.offer);
          await pc.setRemoteDescription(offerDesc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });

          // Caller candidates dinle
          const callerCandidatesRef = collection(roomRef, 'callerCandidates');
          unsubscribeRemoteCandidates = onSnapshot(callerCandidatesRef, (snap) => {
            snap.docChanges().forEach(async (change) => {
              if (change.type === 'added') {
                const cand = new RTCIceCandidate(change.doc.data());
                await pc.addIceCandidate(cand);
              }
            });
          });
        }

        // Room watcher (opsiyonel)
        unsubscribeRoom = onSnapshot(roomRef, () => {});
      } catch (error) {
        console.error(error);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: 'Kamera ve Mikrofon Erişimi Reddedildi',
          description: 'Tarayıcı ayarlarından kamera ve mikrofon izinlerini etkinleştirin.',
        });
      }
    };

    start();

    return () => {
      unsubscribeRoom?.();
      unsubscribeAnswer?.();
      unsubscribeRemoteCandidates?.();

      if (pcRef.current) {
        pcRef.current.ontrack = null;
        pcRef.current.onicecandidate = null;
        pcRef.current.close();
        pcRef.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }

      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };
  }, [lessonId, toast]);

  const toggleMic = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach(track => (track.enabled = !isMicOn));
    setIsMicOn(v => !v);
  };

  const toggleVideo = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach(track => (track.enabled = !isVideoOn));
    setIsVideoOn(v => !v);
  };

  const handleEndCall = async () => {
    // Basit çıkış. İstersen odanın offer answer candidate’larını da temizleriz.
    router.back();
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900 text-white p-4">
      <Card className="w-full max-w-4xl h-full flex flex-col bg-black border-gray-700">
        <CardContent className="relative flex-1 flex items-center justify-center p-0">
          <video ref={remoteVideoRef} className="w-full h-full object-cover rounded-t-lg" autoPlay playsInline />
          <video
            ref={localVideoRef}
            className="absolute bottom-4 right-4 w-40 h-28 object-cover rounded-lg border border-white/30"
            autoPlay
            muted
            playsInline
          />

          {hasPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <Alert variant="destructive" className="max-w-sm">
                <AlertTitle>Kamera ve Mikrofon Gerekli</AlertTitle>
                <AlertDescription>
                  Bu özelliği kullanmak için kamera ve mikrofon erişimine izin verin.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>

        <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-700">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-14 w-14 ${isMicOn ? 'bg-gray-600' : 'bg-red-500'}`}
            onClick={toggleMic}
          >
            {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-14 w-14 ${isVideoOn ? 'bg-gray-600' : 'bg-red-500'}`}
            onClick={toggleVideo}
          >
            {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-14 w-14"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
