importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDFcYA2c6RIPoDnu1aZwEUJe65VmajwrZA",
  authDomain: "homeauto-1a72a.firebaseapp.com",
  databaseURL: "https://homeauto-1a72a.firebaseio.com",
  projectId: "homeauto-1a72a",
  storageBucket: "homeauto-1a72a.appspot.com",
  messagingSenderId: "22320487567",
  appId: "1:22320487567:web:629c7b8e436b6bc21624fa",
  measurementId: "G-D8XMB3LYPX"
};
firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
