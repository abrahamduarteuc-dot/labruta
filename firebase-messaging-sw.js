/* ============================================================
   Corral Lab — Service Worker de notificaciones push (Firebase).
   Este archivo vive en la raíz del sitio (junto a index.html) y
   NO pasa por build.py: lo carga el navegador directamente como
   "/firebase-messaging-sw.js" cuando se registra desde app.js.

   La configuración de abajo es pública (no es secreta): identifica
   el proyecto de Firebase, igual que la URL de un sitio web.
   ============================================================ */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCDg0zwNYuinzXonCJUt8EOiV5K2qoQ1Vw",
  authDomain: "corral-lab-eime5s.firebaseapp.com",
  projectId: "corral-lab-eime5s",
  storageBucket: "corral-lab-eime5s.firebasestorage.app",
  messagingSenderId: "165963851508",
  appId: "1:165963851508:web:694f208618f932225460a1"
});

const messaging = firebase.messaging();

// Notificación recibida mientras la app está cerrada o en segundo plano.
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  const titulo = n.title || "Corral Lab";
  const opciones = {
    body: n.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: payload.data || {},
    tag: (payload.data && payload.data.tag) || undefined
  };
  self.registration.showNotification(titulo, opciones);
});

// Al tocar la notificación: enfoca una pestaña abierta o abre la app.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destino = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((lista) => {
      for (const c of lista) {
        if ("focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(destino);
    })
  );
});
