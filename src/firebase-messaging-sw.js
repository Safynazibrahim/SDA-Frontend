importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDMWzVkMlmgNft4pKNvCpuC_y383M21mRk",
  authDomain: "one-ai-5f96b.firebaseapp.com",
  projectId: "one-ai-5f96b",
  messagingSenderId: "61536759010",
  appId: "1:61536759010:web:f3bc064fcf5ef2930e42bb"
});

const messaging = firebase.messaging();
