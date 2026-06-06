"use client"

import { useEffect } from "react"
import { onMessage } from "firebase/messaging"
import { getFirebaseMessaging } from "../lib/firebase"

export default function NotificationListener() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupNotificationListener = async () => {
      if (typeof window === "undefined") return

      if (Notification.permission !== "granted") {
        console.log("Notifications permission is not granted")
        return
      }

      const messaging = await getFirebaseMessaging()

      if (!messaging) {
        console.log("Firebase messaging is not supported")
        return
      }

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground notification received:", payload)

        const title = payload.notification?.title || "طلب تبرع دم عاجل"
        const body =
          payload.notification?.body ||
          "يوجد طلب تبرع مناسب لفصيلتك ومحافظتك."

        new Notification(title, {
          body,
          icon: "/favicon.ico",
        })
      })
    }

    setupNotificationListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return null
}