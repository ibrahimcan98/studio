// Scripts for firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  "projectId": "studio-5883545682-2eaa4",
  "appId": "1:447632160358:web:6203d93e3a6dc4a2971fa7",
  "storageBucket": "studio-5883545682-2eaa4.appspot.com",
  "apiKey": "AIzaSyBaMRqed7S3Hoo0rbD6yF1Kz5lAdzGkkEU",
  "authDomain": "studio-5883545682-2eaa4.firebaseapp.com",
  "messagingSenderId": "447632160358"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Message received: ', payload);
  
  if (!payload.notification) {
    console.log('[firebase-messaging-sw.js] No notification payload found.');
    return;
  }

  const notificationTitle = payload.notification.title || 'Yeni Bildirim';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: payload.notification.image || '/logo.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
