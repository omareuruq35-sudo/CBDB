importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDRBtD7tWNG2yU1amh2hGS9gecsQ8lfGa8",
  authDomain: "cbdb-f5d61.firebaseapp.com",
  projectId: "cbdb-f5d61",
  storageBucket: "cbdb-f5d61.firebasestorage.app",
  messagingSenderId: "1033994079825",
  appId: "1:1033994079825:web:442bb8e312b950db083270",
  measurementId: "G-ZB8YLKHTWK",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle = payload.notification?.title || "طلب تبرع دم عاجل";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "يوجد طلب تبرع مناسب لفصيلتك ومحافظتك.",
    icon: "/icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});