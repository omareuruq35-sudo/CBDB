const admin = require("../config/firebaseAdmin");

const sendPushNotification = async ({ token, title, body, data = {} }) => {
  if (!token) {
    throw new Error("FCM token is required");
  }

  const message = {
    token,
    notification: {
      title,
      body,
    },
    data,
  };

  return admin.messaging().send(message);
};

module.exports = sendPushNotification;