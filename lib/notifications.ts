import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    if (!("Notification" in window)) {
      return {
        success: false,
        token: null,
        message: "المتصفح لا يدعم الإشعارات",
      };
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return {
        success: false,
        token: null,
        message: "لم يتم السماح بالإشعارات",
      };
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      return {
        success: false,
        token: null,
        message: "Firebase Messaging غير مدعوم في هذا المتصفح",
      };
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      return {
        success: false,
        token: null,
        message: "لم يتم إنشاء كود الإشعارات",
      };
    }

    return {
      success: true,
      token,
      message: "تم تفعيل الإشعارات بنجاح",
    };
  } catch (error) {
    console.error("Notification permission error:", error);

    return {
      success: false,
      token: null,
      message: "حدث خطأ أثناء تفعيل الإشعارات",
    };
  }
};